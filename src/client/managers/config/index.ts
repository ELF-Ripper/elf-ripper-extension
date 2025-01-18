import * as vscode from "vscode";
import * as path from "path";
import { EventEmitter } from "events";

import { Logger } from "../../utils/logger";
import { FolderWatcher } from "../../utils/folder-watcher";
import { FileDiscovery } from "../../utils/file-discovery";
import { resolveVariable } from "./variable-resolver";
import { isDirectory, isFile, stringToUri, uriToString } from "../../utils/helper-functions";
import { SETTINGS } from "../../commands/command-handler/constants";
import { CMakeManager } from "./CMake Tools/manager";

// Event types for internal use
type ConfigEvent = "useMapChanged" | "executionPathChanged" | "discoveredFilesChanged";

/**
 * ConfigurationManager is a singleton class responsible for managing the main settings of the plugin,
 * including the `useMap` setting and the `executionPath`. It handles the resolution of these settings,
 * discovers files based on these core settings, and emits events when these settings or discovered files change.
 */
class ConfigurationManager extends EventEmitter {
  private debounceTimeout: NodeJS.Timeout | undefined;

  private cmakeManager: CMakeManager | undefined;

  // Singleton instance
  private static instance: ConfigurationManager | null = null;

  // User-managed settings
  private useMap: boolean = false;
  private executionPath: string | undefined;

  // Resolved paths information
  private discoveredFiles: { elfFiles: vscode.Uri[]; mapFiles: vscode.Uri[] } | undefined;

  // Constructor is private to ensure singleton pattern
  private constructor() {
    // Initialize logger (Logger instance is automatically created when first used)
    Logger.log("Initialization started...", "info", "Extension");

    super();
    this.updateConfiguration();

    // Register FolderWatcher listeners on constructing the singleton
    FolderWatcher.on("created", () => this.debounceProcessExecutionPath());
    FolderWatcher.on("deleted", () => this.debounceProcessExecutionPath());
  }

  // Access to the singleton instance
  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  /**
   * Debounces the processExecutionPath method to prevent it from being called multiple times
   * in quick succession.
   * This ensures that the method is only executed once after all file events have been processed.
   */
  private debounceProcessExecutionPath(delay: number = 300) {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      this.processExecutionPath();
    }, delay);
  }

  /**
   * Updates the configuration settings from VSCode settings.
   * This is the main entry point for reloading the plugin's settings.
   */
  public async updateConfiguration(): Promise<void> {
    const config = vscode.workspace.getConfiguration();

    // Retrieve the necessary configuration settings
    const modeSetting = config.get<string>(SETTINGS.CONFIG_PROVIDER);
    const executionPathSetting = config.get<string | undefined>(SETTINGS.EXECUTION_PATH);
    const useMapSetting = config.get<boolean>(SETTINGS.USE_MAP);

    // Update the map usage setting if defined
    if (useMapSetting !== undefined) {
      this.setUseMap(useMapSetting);
    }

    // Handle CMake mode
    if (modeSetting === "CMake") {
      // Initialize CMakeManager if it hasn't been created yet
      if (!this.cmakeManager) {
        this.cmakeManager = new CMakeManager();
        await this.cmakeManager.initialize();
        Logger.log("CMakeManager initialized.", "info", "ConfigurationManager");
      }
    } else {
      // Handle Default mode or other future modes
      await this.setExecutionPath(executionPathSetting);

      // Dispose of CMakeManager if it was initialized previously
      if (this.cmakeManager) {
        this.cmakeManager.dispose();
        this.cmakeManager = undefined;
        Logger.log("CMakeManager disposed.", "info", "ConfigurationManager");
      }
    }
  }

  /**
   * Sets and emits changes to the useMap setting.
   * Triggers file re-discovery if the setting changes.
   */
  public async setUseMap(value: boolean) {
    if (this.useMap !== value) {
      this.useMap = value;
      Logger.log(`UseMap setting updated: ${this.useMap}`, "info", "ConfigurationManager");
      this.emit("useMapChanged", this.useMap);

      if (this.executionPath) {
        await this.processExecutionPath();
      }
    }
  }

  /**
   * Sets and resolves changes to the executionPath setting.
   * Emits changes and processes the execution path.
   */
  public async setExecutionPath(value: string | undefined) {
    const resolvedPath = value ? await this.resolveExecutionPath(value) : undefined;
    console.log("Resolved Path", resolvedPath);

    if (this.executionPath !== resolvedPath) {
      this.executionPath = resolvedPath;
      Logger.log(
        `ExecutionPath setting updated: ${this.executionPath}`,
        "info",
        "ConfigurationManager",
      );
      this.emit("executionPathChanged", this.executionPath);
    }

    if (this.executionPath) {
      await this.processExecutionPath(); // Process the execution path only if it's valid
    } else {
      // When user provides an invalid execution path, cleanup the builds and also the targeted artifacts and skips proccessing
      Logger.log("Provided ExecutionPath is invalid!", "error", "ConfigurationManager");
      this.setDiscoveredFiles(undefined);
    }
  }

  /**
   * Stage 2: Resolve the provided execution path.
   *
   * If a variable is found, it attempts to resolve it using the resolveVariable function.
   * Otherwise, it checks if the string is an absolute path.
   *
   * @param value The raw execution path string provided by the user.
   * @returns A resolved absolute path or undefined if invalid.
   */
  private async resolveExecutionPath(value: string): Promise<string | undefined> {
    // Step 1: Trim the input value and check if it's empty or invalid
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      Logger.log("Execution path is empty or invalid.", "error", "ConfigurationManager");
      return undefined;
    }

    // Step 2: Check if the string contains a variable using a regular expression
    const variableRegex = /\$\{([^}]+)\}/;
    const match = trimmedValue.match(variableRegex);

    // Step 3: If no variable is found, check if the string is an absolute path
    if (!match) {
      return path.isAbsolute(trimmedValue) ? path.resolve(trimmedValue) : undefined;
    }

    // Step 4: If a variable is found, resolve it using the resolveVariable function
    const variable = match[1];
    return await resolveVariable(variable, match[0], trimmedValue);
  }

  /**
   * Stage 3: Process the resolved execution path
   *
   * This method is responsible for identifying whether it's a file or directory, then
   * searches for elf and map files, using the FileDiscovery component.
   * Temporarily stores the founded files to be filtered (based on useMap) in the next stage.
   */
  public async processExecutionPath() {
    const resolvedUri = stringToUri(this.executionPath!);

    // Temporary storage for discovered files
    let discoveredFiles: { elfFiles: vscode.Uri[]; mapFiles: vscode.Uri[] };

    try {
      if (await isFile(resolvedUri)) {
        discoveredFiles = await this.discoverFilesInParentFolder(resolvedUri);
      } else if (await isDirectory(resolvedUri)) {
        discoveredFiles = await this.discoverFilesInDirectory(resolvedUri);
      } else {
        // When user provides an invalid execution path, cleanup the builds and also the targeted artifacts
        this.setDiscoveredFiles(undefined);
        throw new Error("Provided ExecutionPath is invalid!");
      }

      // Apply discovered files
      this.applyDiscoveredFiles(discoveredFiles);
    } catch (error) {
      Logger.log(error.message, "error", "ConfigurationManager");
      vscode.window.showErrorMessage(error.message);
    }
  }

  /**
   * Discovers files in the parent folder if the execution path is pointing to a file.
   * Initializes a FolderWatcher on the parent directory to monitor changes.
   */
  private async discoverFilesInParentFolder(fileUri: vscode.Uri) {
    Logger.log(`Processing file path: ${uriToString(fileUri)}`, "info", "ConfigurationManager");

    const parentDir = vscode.Uri.file(path.dirname(uriToString(fileUri)));

    // Initialize the FolderWatcher to watch the parent directory
    FolderWatcher.initializeWatcher(uriToString(parentDir));

    return FileDiscovery.discoverFiles(uriToString(parentDir));
  }

  /**
   * Discovers files in the directory if the execution path is pointing to a folder.
   * Initializes a FolderWatcher on the directory to monitor changes.
   */
  private async discoverFilesInDirectory(dirUri: vscode.Uri) {
    Logger.log(`Processing directory path: ${uriToString(dirUri)}`, "info", "ConfigurationManager");

    // Initialize the FolderWatcher to watch the directory
    FolderWatcher.initializeWatcher(uriToString(dirUri));

    return FileDiscovery.discoverFiles(uriToString(dirUri));
  }

  /**
   * Stage 4: Apply discovered files based on the useMap setting.
   *
   * This method is responsible to Filter out MAP files if useMap is false.
   */
  private applyDiscoveredFiles(discoveredFiles: {
    elfFiles: vscode.Uri[];
    mapFiles: vscode.Uri[];
  }) {
    if (!discoveredFiles) return;

    const elfFiles = discoveredFiles.elfFiles;
    const mapFiles = this.useMap ? discoveredFiles.mapFiles : [];
    this.setDiscoveredFiles({ elfFiles, mapFiles });
  }

  /**
   * Sets and emits the discovered files, which consist of ELF and MAP files found
   * based on the execution path and useMap setting.
   */
  public setDiscoveredFiles(value: { elfFiles: vscode.Uri[]; mapFiles: vscode.Uri[] } | undefined) {
    this.discoveredFiles = value;
    Logger.logObject(this.discoveredFiles, "info", "ConfigurationManager");
    this.emit("discoveredFilesChanged", this.discoveredFiles);
  }

  /**
   * Retrieves the currently discovered files, including ELF and MAP files.
   */
  public getDiscoveredFiles(): { elfFiles: vscode.Uri[]; mapFiles: vscode.Uri[] } | undefined {
    return this.discoveredFiles;
  }

  /**
   * Retrieves the current useMap setting.
   */
  public getUseMap(): boolean {
    return this.useMap;
  }

  /**
   * Retrieves the current execution path setting.
   */
  public getExecutionPath(): string | undefined {
    return this.executionPath;
  }

  /**
   * Subscribes to configuration events with a callback, allowing external components to react to changes.
   */
  public onConfigChange(event: ConfigEvent, callback: (value: any) => void) {
    this.on(event, callback);
  }
}

export const configManager = ConfigurationManager.getInstance();
export default ConfigurationManager;
