import * as vscode from "vscode";
import * as path from "path";
import { buildArtifactsManager } from "../managers/build-artifacts";
import { uriToString } from "../utils/helper-functions";

/**
 * Provides the tree view for displaying the currently selected ELF and Map files in the Target view.
 * This view is dynamically updated based on changes to the selected ELF and Map files within the
 * buildArtifactsManager. It supports context menus for selecting and clearing target files,
 * allowing the user to manage their target files directly from the view.
 */
export class TargetViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  // Labels for the parent nodes
  private readonly ELF_PARENT_LABEL = "ELF Path:";
  private readonly MAP_PARENT_LABEL = "Map Path:";

  // Label used when no files are selected
  private readonly UNDEFINED_LABEL = "Undefined";

  // Icons for the TreeItems
  private readonly ELF_ICON = new vscode.ThemeIcon("file-binary");
  private readonly MAP_ICON = new vscode.ThemeIcon("file-code");

  // Context values used for parent nodes
  private readonly ELF_PARENT_CONTEXT = "elfTarget";
  private readonly MAP_PARENT_CONTEXT = "mapTarget";

  // Context values used for defined paths
  private readonly ELF_DEFINED_CONTEXT = "elfPath";
  private readonly MAP_DEFINED_CONTEXT = "mapPath";

  // Event emitter to signal changes in the tree data (triggers view refresh)
  private _onDidChangeTreeData: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData: vscode.Event<void> = this._onDidChangeTreeData.event;

  constructor() {
    // Listen for changes to the ELF and Map paths in the buildArtifactsManager
    buildArtifactsManager.onArtifactsChange("pathToELFChanged", () =>
      this._onDidChangeTreeData.fire(),
    );
    buildArtifactsManager.onArtifactsChange("pathToMapChanged", () =>
      this._onDidChangeTreeData.fire(),
    );
  }

  /**
   * Provides the tree items to be displayed in the view.
   * @param element The TreeItem element.
   * @returns The TreeItem to display in the view.
   */
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Returns the child elements for the given element.
   * If no element is provided, return the top-level parent items.
   * @param element The parent TreeItem (usually undefined).
   * @returns An array of TreeItems representing the parent and child nodes.
   */
  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    if (!element) {
      return this.getParentItems();
    }

    // Handle child elements (the actual paths) for the parent items
    if (element.contextValue === this.ELF_PARENT_CONTEXT) {
      return this.getElfChildItems();
    } else if (element.contextValue === this.MAP_PARENT_CONTEXT) {
      return this.getMapChildItems();
    }

    return [];
  }

  /**
   * Retrieves the top-level parent items: "ELF Path:" and "Map Path:".
   * @returns An array of TreeItems representing the parent nodes for ELF and Map paths.
   */
  private async getParentItems(): Promise<vscode.TreeItem[]> {
    const elfParentItem = new vscode.TreeItem(
      this.ELF_PARENT_LABEL,
      vscode.TreeItemCollapsibleState.Expanded,
    );
    elfParentItem.contextValue = this.ELF_PARENT_CONTEXT;
    elfParentItem.tooltip = "Click to manage or view the ELF target file path.";

    const mapParentItem = new vscode.TreeItem(
      this.MAP_PARENT_LABEL,
      vscode.TreeItemCollapsibleState.Expanded,
    );
    mapParentItem.contextValue = this.MAP_PARENT_CONTEXT;
    mapParentItem.tooltip = "Click to manage or view the Map target file path.";

    return [elfParentItem, mapParentItem];
  }

  /**
   * Retrieves the child item representing the ELF path or "Undefined" if not set.
   * @returns An array containing a single TreeItem for the ELF path.
   */
  private async getElfChildItems(): Promise<vscode.TreeItem[]> {
    const elfFilePath = buildArtifactsManager.getPathToELF();

    const elfItem = new vscode.TreeItem(
      elfFilePath ? this.getDisplayPath(elfFilePath) : this.UNDEFINED_LABEL,
      vscode.TreeItemCollapsibleState.None,
    );
    elfItem.iconPath = this.ELF_ICON;
    elfItem.tooltip = elfFilePath
      ? uriToString(elfFilePath)
      : "Select an ELF for processing, and obtain the analysis.";
    elfItem.contextValue = elfFilePath ? this.ELF_DEFINED_CONTEXT : undefined;

    return [elfItem];
  }

  /**
   * Retrieves the child item representing the Map path or "Undefined" if not set.
   * @returns An array containing a single TreeItem for the Map path.
   */
  private async getMapChildItems(): Promise<vscode.TreeItem[]> {
    const mapFilePath = buildArtifactsManager.getPathToMap();

    const mapItem = new vscode.TreeItem(
      mapFilePath ? this.getDisplayPath(mapFilePath) : this.UNDEFINED_LABEL,
      vscode.TreeItemCollapsibleState.None,
    );
    mapItem.iconPath = this.MAP_ICON;
    mapItem.tooltip = mapFilePath
      ? uriToString(mapFilePath)
      : "Select a Map for processing, and obtain the analysis.";
    mapItem.contextValue = mapFilePath ? this.MAP_DEFINED_CONTEXT : undefined;

    return [mapItem];
  }

  /**
   * Formats the display path for ELF and Map files, showing the last two directories and the filename.
   * @param uri The URI of the file.
   * @returns A string formatted as "lastTwoDirs/filename".
   */
  private getDisplayPath(uri: vscode.Uri): string {
    const fullPath = uriToString(uri);
    const parts = fullPath?.split(path.sep) ?? [];
    const lastTwoDirs = parts.slice(-3, -1).join(path.sep);
    const fileName = parts[parts.length - 1];
    return `${lastTwoDirs}${path.sep}${fileName}`;
  }
}
