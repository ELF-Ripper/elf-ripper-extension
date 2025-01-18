import * as vscode from "vscode";

import { COMMANDS, SETTINGS } from "../commands/command-handler/constants";
import { uriToString } from "../utils/helper-functions";
import { buildArtifactsManager } from "./build-artifacts";
import { Logger } from "../utils/logger";

/**
 * Manages the status bar item in the VS Code window.
 * Controls the visibility and content of the status bar item based on user settings and build artifacts.
 */
export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem | undefined;
  private useStatusBar: boolean = true; // Default is true
  private useMap: boolean = true;

  constructor() {
    Logger.log("StatusBarManager instantiated.", "info", "StatusBarManager");

    // Listen for artifact changes in BuildArtifactsManager
    buildArtifactsManager.onArtifactsChange("pathToELFChanged", this.updateStatusBar.bind(this));
    buildArtifactsManager.onArtifactsChange("pathToMapChanged", this.updateStatusBar.bind(this));
    buildArtifactsManager.onArtifactsChange("artifactsUpdated", this.updateStatusBar.bind(this));

    // Initialize based on current settings
    this.onConfigurationChanged();
  }

  /**
   * Update configuration settings (useStatusBar, useMap)
   */
  public onConfigurationChanged() {
    const config = vscode.workspace.getConfiguration();
    this.useStatusBar = config.get<boolean>(SETTINGS.USE_STATUS_BAR);
    this.useMap = config.get<boolean>(SETTINGS.USE_MAP);

    // Hide or show the status bar item based on useStatusBar setting
    if (!this.useStatusBar) {
      this.disposeStatusBarItem();
    } else {
      this.ensureStatusBarItem();
      this.updateStatusBar();
    }
  }

  /**
   * Update the StatusBar item based on the current build artifacts and settings.
   */
  private updateStatusBar() {
    if (!this.statusBarItem || !this.useStatusBar) {
      return;
    }

    const pathToELF = buildArtifactsManager.getPathToELF();
    const pathToMap = buildArtifactsManager.getPathToMap();
    const buildPath = this.getBuildPathByArtifact(pathToELF, pathToMap);

    if (this.useMap) {
      if (pathToELF && pathToMap) {
        this.statusBarItem.text = `$(octoface) Current Build: ${buildPath}`;
      } else {
        this.statusBarItem.text = `$(octoface) Current Build: Unknown Build`;
      }
    } else {
      if (pathToELF) {
        this.statusBarItem.text = `$(octoface) Current Build: ${buildPath}`;
      } else {
        this.statusBarItem.text = `$(octoface) Current Build: Unknown Build`;
      }
    }

    // Tooltip showing ELF and MAP paths
    this.statusBarItem.tooltip =
      `Click to select a build and set it as target.\n` +
      `ELF Path: ${uriToString(pathToELF) || "No ELF file available"}\n` +
      `MAP Path: ${uriToString(pathToMap) || "No MAP file available"}`;

    this.statusBarItem.show();
  }

  /**
   * Get the build path based on the ELF and MAP URIs.
   * @param pathToELF URI of the ELF file.
   * @param pathToMap URI of the MAP file.
   * @returns Build path as a string.
   */
  private getBuildPathByArtifact(
    pathToELF: vscode.Uri | undefined,
    pathToMap: vscode.Uri | undefined,
  ): string {
    const buildArtifacts = buildArtifactsManager.getBuildArtifacts();

    for (const buildPath in buildArtifacts) {
      const build = buildArtifacts[buildPath];
      if (
        uriToString(build.elf) === uriToString(pathToELF) &&
        uriToString(build.map) === uriToString(pathToMap)
      ) {
        return buildPath;
      }
    }

    return "Unknown Build";
  }

  /**
   * Ensure the status bar item is created and shown.
   */
  private ensureStatusBarItem() {
    if (!this.statusBarItem) {
      this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
      this.statusBarItem.command = {
        command: COMMANDS.SELECT_BUILD,
        title: "Select your build!",
      };
      this.statusBarItem.show();
    }
  }

  /**
   * Dispose of the status bar item.
   */
  private disposeStatusBarItem() {
    if (this.statusBarItem) {
      this.statusBarItem.dispose();
      this.statusBarItem = undefined;
    }
  }

  /**
   * Dispose of the status bar manager.
   */
  public dispose() {
    Logger.log("Disposing StatusBarManager...", "info", "StatusBarManager");
    this.disposeStatusBarItem();
  }
}
