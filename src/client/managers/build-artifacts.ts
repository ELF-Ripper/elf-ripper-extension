import * as vscode from "vscode";
import path from "path";
import { EventEmitter } from "events";

import { configManager } from "./config";
import { Logger } from "../utils/logger";
import { isFile, stringToUri, uriToString } from "../utils/helper-functions";
import { COMMANDS } from "../commands/command-handler/constants";

// Event types for internal use
type BuildArtifactsEvent = "artifactsUpdated" | "pathToELFChanged" | "pathToMapChanged";

export interface BuildArtifact {
  elf: vscode.Uri | undefined;
  map: vscode.Uri | undefined;
}

export interface BuildArtifacts {
  [buildPath: string]: BuildArtifact;
}

/**
 * The BuildArtifactsManager is a singleton class responsible for managing and organizing
 * build artifacts (such as ELF and MAP files) within the user's workspace. It relies on
 * the execution path provided in the plugin's configuration to locate and categorize
 * these artifacts. The manager keeps track of the paths to these artifacts, emits events
 * when paths are updated, and provides utilities for accessing and modifying the stored
 * build artifacts.
 *
 * This class plays a central role in the plugin's functionality, as it provides the
 * necessary data for other components, such as tree views or command handlers, to
 * present and interact with the build artifacts effectively.
 */
class BuildArtifactsManager extends EventEmitter {
  // Singleton instance
  private static instance: BuildArtifactsManager | null = null;

  // Available builds based on the exeuction path
  private buildArtifacts: BuildArtifacts = {};

  // Targeted ELF and Map artifacts
  private pathToELF: vscode.Uri | undefined;
  private pathToMap: vscode.Uri | undefined;

  /**
   * Private constructor to enforce singleton pattern.
   * Initializes the manager by syncing with discovered files and setting up listeners for configuration changes.
   */
  private constructor() {
    super();
    configManager.onConfigChange("discoveredFilesChanged", this.syncWithDiscoveredFiles.bind(this));
  }

  /**
   * Retrieves the singleton instance of the BuildArtifactsManager.
   * @returns The single instance of the BuildArtifactsManager.
   */
  public static getInstance(): BuildArtifactsManager {
    if (!BuildArtifactsManager.instance) {
      BuildArtifactsManager.instance = new BuildArtifactsManager();
    }
    return BuildArtifactsManager.instance;
  }

  /**
   * Synchronizes the build artifacts with the discovered files based on the execution path
   * provided in the ConfigurationManager. This method categorizes ELF and MAP files and
   * organizes them by build paths relative to the execution path.
   */
  private async syncWithDiscoveredFiles() {
    Logger.log("Syncing build artifacts with discovered files...", "info", "BuildArtifactsManager");

    const discoveredFiles = configManager.getDiscoveredFiles();
    const newBuildArtifacts: BuildArtifacts = {};

    if (discoveredFiles) {
      const addArtifactPromises = [
        ...discoveredFiles.elfFiles.map(elfUri =>
          this.addArtifact(newBuildArtifacts, elfUri, "elf"),
        ),
        ...discoveredFiles.mapFiles.map(mapUri =>
          this.addArtifact(newBuildArtifacts, mapUri, "map"),
        ),
      ];

      await Promise.all(addArtifactPromises);
    } else {
      this.setPathToELF(undefined);
      this.setPathToMap(undefined);
    }

    this.setBuildArtifacts(newBuildArtifacts);
  }

  /**
   * Adds an ELF or MAP artifact to the buildArtifacts collection.
   * @param artifacts The BuildArtifacts object to modify.
   * @param fileUri The URI of the ELF or MAP file.
   * @param type The type of artifact ("elf" or "map").
   */
  private async addArtifact(artifacts: BuildArtifacts, fileUri: vscode.Uri, type: "elf" | "map") {
    try {
      const buildPath = await this.getBuildPath(fileUri);

      if (!artifacts[buildPath]) {
        artifacts[buildPath] = { elf: undefined, map: undefined };
      }
      artifacts[buildPath][type] = fileUri;
    } catch (error) {
      Logger.log(`Failed to add artifact: ${error.message}`, "error", "BuildArtifactsManager");
    }
  }

  /**
   * Sets the build artifacts and triggers an appropriate action if they have changed.
   * @param newBuildArtifacts The new build artifacts to set.
   */
  private setBuildArtifacts(newBuildArtifacts: BuildArtifacts) {
    if (JSON.stringify(this.buildArtifacts) !== JSON.stringify(newBuildArtifacts)) {
      this.buildArtifacts = newBuildArtifacts;
      Logger.logObject(this.buildArtifacts, "info", "BuildArtifactsManager");
      this.emit("artifactsUpdated", this.buildArtifacts);
      this.handleBuildSelection();
    } else {
      Logger.log("No changes in build artifacts detected.", "info", "BuildArtifactsManager");
    }
  }

  /**
   * Automatically handles the selection of a build based on the number of builds available.
   */
  private async handleBuildSelection() {
    const buildKeys = Object.keys(this.buildArtifacts);
    const buildCount = buildKeys.length;

    if (buildCount === 0) {
      Logger.log(
        "No builds found. Please ensure your execution path is correct.",
        "warning",
        "BuildArtifactsManager",
      );

      vscode.window.showWarningMessage(
        "No builds found. Please ensure your execution path is correct.",
      );
    } else if (buildCount === 1) {
      Logger.log("Founded a single build, setting it as target.", "info", "BuildArtifactsManager");
      const singleBuild = this.buildArtifacts[buildKeys[0]];
      await vscode.commands.executeCommand(COMMANDS.SELECT_BUILD, singleBuild.elf, singleBuild.map);
    } else {
      Logger.log(
        `Founded ${buildCount} builds. Waiting for a target...`,
        "info",
        "BuildArtifactsManager",
      );
    }
  }

  /**
   * Extracts the build path relative to the execution path set in the configuration.
   * @param fileUri The URI of the ELF or MAP file.
   * @returns The normalized relative build path.
   */
  private async getBuildPath(fileUri: vscode.Uri): Promise<string> {
    const executionPath = configManager.getExecutionPath();
    if (!executionPath) {
      return ""; // No execution path provided
    }

    const executionPathUri = stringToUri(executionPath);
    const isExecutionFile = await isFile(executionPathUri);

    if (isExecutionFile) {
      // If execution path is a file, return its parent directory name
      return path.basename(path.dirname(executionPath));
    }

    // If execution path is a directory, get the relative path
    const relativePath = path.normalize(
      path.relative(executionPath, path.dirname(uriToString(fileUri)!)),
    );

    // If the relative path is ".", return the directory name instead
    return relativePath === "." ? path.basename(executionPath) : relativePath;
  }

  /**
   * Retrieves the organized build artifacts.
   * @returns The current state of the build artifacts.
   */
  public getBuildArtifacts(): BuildArtifacts {
    return this.buildArtifacts;
  }

  /**
   * Clears the path to the ELF or MAP file.
   * @param type Optional argument specifying whether to clear the "ELF" or "MAP" path.
   *             If not specified, clears both paths.
   */
  public clearPaths(type?: "ELF" | "MAP"): void {
    if (!type || type === "ELF") {
      this.setPathToELF(undefined);
    }
    if (!type || type === "MAP") {
      this.setPathToMap(undefined);
    }
  }

  /**
   * Retrieves the current ELF file path.
   * @returns The current ELF file URI.
   */
  public getPathToELF(): vscode.Uri | undefined {
    return this.pathToELF;
  }

  /**
   * Sets the ELF file path and emits an event if the path changes.
   * @param elfUri The new ELF file URI.
   */
  public setPathToELF(elfUri: vscode.Uri | undefined) {
    if (uriToString(this.pathToELF) !== uriToString(elfUri)) {
      this.pathToELF = elfUri;
      Logger.log(`Path to ELF set: ${uriToString(elfUri)}`, "info", "BuildArtifactsManager");
      this.emit("pathToELFChanged", this.pathToELF);
    }
  }

  /**
   * Retrieves the current MAP file path.
   * @returns The current MAP file URI.
   */
  public getPathToMap(): vscode.Uri | undefined {
    return this.pathToMap;
  }

  /**
   * Sets the MAP file path and emits an event if the path changes.
   * @param mapUri The new MAP file URI.
   */
  public setPathToMap(mapUri: vscode.Uri | undefined) {
    if (uriToString(this.pathToMap) !== uriToString(mapUri)) {
      this.pathToMap = mapUri;
      Logger.log(`Path to MAP set: ${uriToString(mapUri)}`, "info", "BuildArtifactsManager");
      this.emit("pathToMapChanged", this.pathToMap);
    }
  }

  /**
   * Subscribes to build artifacts events with a callback function.
   * @param event The event type to listen for.
   * @param callback The callback to invoke when the event occurs.
   */
  public onArtifactsChange(event: BuildArtifactsEvent, callback: (value: any) => void) {
    this.on(event, callback);
  }
}

export const buildArtifactsManager = BuildArtifactsManager.getInstance();
export default BuildArtifactsManager;
