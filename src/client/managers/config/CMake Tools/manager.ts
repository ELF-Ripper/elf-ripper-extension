import * as vscode from "vscode";
import path from "path";

import {
  getCMakeToolsApi,
  Version,
  CMakeToolsApi,
  Project,
  CodeModel,
  ConfigurationType,
} from "./get-api";
import { Logger } from "../../../utils/logger";
import { stringToUri } from "../../../utils/helper-functions";
import { configManager } from "../index"; // Assuming this is the correct import

export class CMakeManager {
  private cmakeApi: CMakeToolsApi | undefined;
  private projectStructure: Project | undefined; // Stores the active project
  private buildDirectory: string | undefined;
  private codeModel: CodeModel.Content | undefined;
  private buildTarget: string | undefined;
  private executableTargets: Map<string, string> = new Map(); // Store executable target names and paths
  private listeners: vscode.Disposable[] = [];
  private pollingInterval = 3000; // 3 seconds polling interval
  private _executionPath: string | undefined; // Stores the final execution path internally

  /**
   * Initializes the CMake Manager by obtaining the CMake Tools API and setting up listeners.
   * If the API is not available, it retries periodically to retrieve it.
   */
  public async initialize(): Promise<void> {
    if (!this.cmakeApi) {
      await this.getCMakeApiWithRetry();
    }

    if (this.cmakeApi) {
      await this.initializeProject();
    }
  }

  /**
   * Attempts to get the CMake API, with a retry mechanism in case of failure.
   * Once retrieved, it will trigger the rest of the business logic.
   */
  private async getCMakeApiWithRetry(): Promise<void> {
    try {
      this.cmakeApi = await getCMakeToolsApi(Version.latest);
      if (!this.cmakeApi) throw new Error("CMake Tools API is undefined");

      Logger.log("Successfully retrieved CMake Tools API", "info", "CMakeManager");

      // After successfully retrieving the API, initialize the project
      await this.initializeProject();
    } catch {
      Logger.log("Failed to get CMake Tools API. Retrying...", "error", "CMakeManager");

      setTimeout(() => this.getCMakeApiWithRetry(), this.pollingInterval);
    }
  }

  /**
   * Initializes the project and registers listeners.
   */
  private async initializeProject(): Promise<void> {
    Logger.log("Initializing project data.", "info", "CMakeManager");

    await this.handleActiveProjectChange();
    this.registerListeners();
  }

  /**
   * Handles the logic of getting the active project and updating the project structure.
   * Called both at initialization and when the active project changes.
   */
  private async handleActiveProjectChange(uri?: vscode.Uri): Promise<void> {
    const projectUri = uri || stringToUri(this.cmakeApi?.getActiveFolderPath() ?? "");
    this.projectStructure = await this.cmakeApi?.getProject(projectUri);

    if (this.projectStructure) {
      Logger.log(`Active project successfully loaded.`, "info", "CMakeManager");
      await this.updateProjectData();
    } else {
      Logger.log("No active project found.", "warning", "CMakeManager");
    }
  }

  /**
   * Updates the project data: Build Directory, CodeModel, and BuildTarget.
   */
  private async updateProjectData(): Promise<void> {
    await Promise.all([
      this.retrieveBuildDirectory(),
      this.retrieveCodeModel(),
      this.retrieveBuildTarget(),
    ]);
    this.updateExecutionPath(); // Update the executionPath after all data is retrieved
  }

  /**
   * Registers the necessary listeners for CMake-related events.
   */
  private registerListeners(): void {
    if (!this.cmakeApi || !this.projectStructure) return;

    // Register listener for active project changes
    this.registerListener(
      this.cmakeApi.onActiveProjectChanged,
      async (uri: vscode.Uri | undefined) => {
        Logger.log(
          `Active project changed to: ${uri?.toString() ?? "None"}`,
          "info",
          "CMakeManager",
        );
        await this.handleActiveProjectChange(uri);
      },
    );

    // Register listener for configuration changes
    this.registerListener(
      this.projectStructure.onSelectedConfigurationChanged,
      async (configurationType: ConfigurationType) => {
        Logger.log(`Configuration changed to: ${configurationType}`, "info", "CMakeManager");
        await this.retrieveBuildDirectory();
        this.updateExecutionPath();
      },
    );

    // Register listener for code model changes
    this.registerListener(this.projectStructure.onCodeModelChanged, async () => {
      Logger.log("Code model changed. Updating executable targets...", "info", "CMakeManager");
      await this.retrieveCodeModel();
      this.updateExecutionPath();
    });

    // Register listener for build target changes
    this.registerListener(this.cmakeApi.onBuildTargetChanged, async (target: string) => {
      Logger.log(`Build target changed to: ${target}`, "info", "CMakeManager");
      this.buildTarget = target;
      this.updateExecutionPath();
    });
  }

  /**
   * Helper method to register listeners and store disposables.
   */
  private registerListener<T>(event: vscode.Event<T>, callback: (e: T) => Promise<void>): void {
    const listener = event(callback);
    this.listeners.push(listener);
  }

  /**
   * Retrieves the build directory path for the current project and logs it.
   */
  private async retrieveBuildDirectory(): Promise<void> {
    this.buildDirectory = await this.projectStructure?.getBuildDirectory();
    Logger.log(`Build Directory: ${this.buildDirectory ?? "undefined"}`, "info", "CMakeManager");
  }

  /**
   * Retrieves and processes the code model, storing executable targets in a map.
   */
  private async retrieveCodeModel(): Promise<void> {
    this.codeModel = this.projectStructure?.codeModel;
    Logger.log("Code Model successfully retrieved.", "info", "CMakeManager");

    this.processExecutableTargets();
  }

  /**
   * Processes the code model to store executable targets.
   */
  private processExecutableTargets(): void {
    const targets = this.codeModel?.configurations?.[0]?.projects?.[0]?.targets ?? [];
    this.executableTargets.clear();

    targets.forEach(target => {
      if (target.type === "EXECUTABLE" && target.artifacts?.length) {
        let artifactPath = this.removeDuplicateFolders(target.artifacts[0]);
        this.executableTargets.set(target.name, artifactPath);
        Logger.log(`Executable Target: ${target.name} at ${artifactPath}`, "info", "CMakeManager");
      }
    });
  }

  /**
   * Removes duplicate folder segments from the provided path, handling both Windows and Unix-style separators.
   * For example: /path/to/folder/folder/file or C:\\path\\to\\folder\\folder\\file will become /path/to/folder/file or C:\\path\\to\\folder\\file.
   *
   * @param artifactPath The full artifact path as a string.
   * @returns The corrected path without duplicated folders.
   */
  private removeDuplicateFolders(artifactPath: string): string {
    // Normalize the path to ensure consistent path separators (handles both '/' and '\')
    const normalizedPath = path.normalize(artifactPath);

    // Split the normalized path into segments based on the platform-specific separator
    const segments = normalizedPath.split(path.sep).filter(Boolean);

    // Remove duplicate segments
    const uniqueSegments: string[] = [];
    segments.forEach((segment, index) => {
      if (index === 0 || segment !== segments[index - 1]) {
        uniqueSegments.push(segment);
      }
    });

    // Join the segments back using the correct platform-specific separator
    let correctedPath = path.join(...uniqueSegments);

    // Ensure the corrected path has a leading slash for Unix-like systems
    if (artifactPath.startsWith("/") && !correctedPath.startsWith("/")) {
      correctedPath = `/${correctedPath}`;
    }

    // For Windows, ensure the corrected path starts with a drive letter if necessary
    if (artifactPath[1] === ":" && correctedPath[1] !== ":") {
      correctedPath = `${artifactPath[0]}:${correctedPath}`;
    }

    return correctedPath;
  }

  /**
   * Retrieves the current build target using the CMake command "cmake.buildTargetName".
   */
  private async retrieveBuildTarget(): Promise<void> {
    try {
      this.buildTarget =
        (await vscode.commands.executeCommand<string>("cmake.buildTargetName")) ?? "";
      Logger.log(`Current Build Target: ${this.buildTarget}`, "info", "CMakeManager");
    } catch {
      this.buildTarget = undefined;
      Logger.log("Failed to retrieve build target.", "error", "CMakeManager");
    }
  }

  /**
   * Updates the execution path based on the current build target.
   * If the build target is in the executable targets map, it uses the artifact path.
   * Otherwise, it defaults to the build directory.
   */
  private updateExecutionPath(): void {
    this._executionPath = this.executableTargets.get(this.buildTarget ?? "") || this.buildDirectory;
    Logger.log(`Execution Path updated to: ${this._executionPath}`, "info", "CMakeManager");

    this.setExecutionPath(this._executionPath);
  }

  /**
   * Sets the execution path in the configuration manager.
   */
  private setExecutionPath(path: string | undefined): void {
    if (path) {
      configManager.setExecutionPath(path);
      Logger.log(`Execution Path set in configManager: ${path}`, "info", "CMakeManager");
    }
  }

  /**
   * Disposes of all listeners and cleans up resources.
   */
  public dispose(): void {
    this.disposeListeners();
    Logger.log("Disposed all CMakeManager listeners.", "info", "CMakeManager");
  }

  /**
   * Disposes of all listeners.
   */
  private disposeListeners(): void {
    this.listeners.forEach(listener => listener.dispose());
    this.listeners = [];
  }
}
