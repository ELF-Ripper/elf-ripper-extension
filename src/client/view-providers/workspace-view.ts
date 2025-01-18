import * as vscode from "vscode";
import { buildArtifactsManager, BuildArtifacts, BuildArtifact } from "../managers/build-artifacts";
import { COMMANDS } from "../commands/command-handler/constants";

/**
 * WorkspaceViewProvider is responsible for managing and displaying a custom tree view
 * in the activity bar. This tree view provides an organized representation
 * of the available builds in the workspace.
 *
 * Key Features:
 * - Lists available builds retrieved from the BuildArtifactsManager, each with associated ELF and MAP files.
 * - Provides contextual commands for selecting builds and opening files directly from the tree view.
 * - Automatically updates the tree view when the build artifacts change.
 */
export class WorkspaceViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData: vscode.Event<void> = this._onDidChangeTreeData.event;

  // Constants for icons and labels
  private static readonly AVAILABLE_BUILDS_LABEL = "Available Builds:";
  private static readonly AVAILABLE_BUILDS_ICON = new vscode.ThemeIcon("file-directory");
  private static readonly BUILD_ICON = new vscode.ThemeIcon("tools");
  private static readonly NO_BUILDS_WARNING_ICON = new vscode.ThemeIcon("extensions-info-message");
  private static readonly NO_FILE = "File not available";

  constructor() {
    // Register listeners for "Available Builds Node"
    buildArtifactsManager.onArtifactsChange("artifactsUpdated", () =>
      this._onDidChangeTreeData.fire(),
    );
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    if (!element) {
      return this.getTopLevelItems();
    }

    if (element.contextValue === "availableBuilds") {
      return this.getAvailableBuilds();
    }

    return [];
  }

  /**
   * Retrieves the top-level items for the tree view, which include the available builds.
   */
  private async getTopLevelItems(): Promise<vscode.TreeItem[]> {
    const items: vscode.TreeItem[] = [];

    // Add "Available Builds" node
    items.push(this.createAvailableBuildsItem());

    return items;
  }

  /**
   * Creates a tree item for the "Available Builds" section.
   */
  private createAvailableBuildsItem(): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(
      WorkspaceViewProvider.AVAILABLE_BUILDS_LABEL,
      vscode.TreeItemCollapsibleState.Expanded,
    );
    treeItem.tooltip = "List of available builds. Click to set it as the targeted build.";
    treeItem.contextValue = "availableBuilds";
    treeItem.iconPath = WorkspaceViewProvider.AVAILABLE_BUILDS_ICON;
    return treeItem;
  }

  /**
   * Retrieves and creates tree items for all available builds.
   * If no builds are available, it shows a message indicating that.
   */
  private async getAvailableBuilds(): Promise<vscode.TreeItem[]> {
    const builds: BuildArtifacts = buildArtifactsManager.getBuildArtifacts();

    if (Object.keys(builds).length === 0) {
      // No builds available, return a single item indicating that
      const noBuildsItem = new vscode.TreeItem(
        "No builds available",
        vscode.TreeItemCollapsibleState.None,
      );
      noBuildsItem.tooltip = "There are no builds available in the specified execution path.";
      noBuildsItem.iconPath = WorkspaceViewProvider.NO_BUILDS_WARNING_ICON;
      return [noBuildsItem];
    }

    // If builds are available, return the list of build items
    return Object.keys(builds).map(buildPath => {
      const build: BuildArtifact = builds[buildPath];
      const elfPath = build.elf ? build.elf.fsPath : WorkspaceViewProvider.NO_FILE;
      const mapPath = build.map ? build.map.fsPath : WorkspaceViewProvider.NO_FILE;

      const treeItem = new vscode.TreeItem(buildPath, vscode.TreeItemCollapsibleState.None);
      treeItem.tooltip = `Build Path: ${buildPath}\nELF: ${elfPath}\nMAP: ${mapPath}`;
      treeItem.contextValue = "buildItem";
      treeItem.iconPath = WorkspaceViewProvider.BUILD_ICON;

      treeItem.command = {
        command: COMMANDS.SELECT_BUILD,
        title: "Select Build",
        arguments: [build],
      };

      return treeItem;
    });
  }

  /**
   * Disposes the view provider and its resources.
   */
  public dispose(): void {
    this._onDidChangeTreeData.dispose();
  }
}
