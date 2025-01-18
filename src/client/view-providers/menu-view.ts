import * as vscode from "vscode";
import { COMMANDS } from "../commands/command-handler/constants";

/**
 * MenuViewProvider provides a static tree view for the ELF Ripper extension.
 * It consists of two parent nodes: "Select a Build" and "Analyzis".
 * The "Analyzis" node contains child commands for "Open Dashboard" and "Open Build Analyzer".
 */
export class MenuViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  // Constants for labels and icons used in the TreeItems
  private readonly SELECT_BUILD_LABEL = "Select a Build";
  private readonly ANALYSIS_LABEL = "Analyzis";
  private readonly DASHBOARD_LABEL = "Open Dashboard";
  private readonly BUILD_ANALYZER_LABEL = "Open Build Analyzer";
  private readonly SELECT_BUILD_TOOLTIP =
    "Select from the available builds and set the targeted artifacts.";
  private readonly SELECT_BUILD_ICON = new vscode.ThemeIcon("inspect");
  private readonly ANALYSIS_ICON = new vscode.ThemeIcon("eye");

  /**
   * Returns the TreeItem representation of the given element.
   * This determines how the item is displayed in the tree view.
   * @param element The TreeItem element to be displayed.
   * @returns The TreeItem to display in the view.
   */
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Returns the child elements for the given element.
   * If no element is provided, the top-level parent items are returned.
   * If the "Analyzis" parent item is selected, the child commands ("Open Dashboard" and
   * "Open Build Analyzer") are returned as children.
   * @param element The parent TreeItem.
   * @returns An array of TreeItems for the parent and its children.
   */
  getChildren(element?: vscode.TreeItem): vscode.TreeItem[] {
    if (!element) {
      // Return the top-level parent items
      return [this.createSelectBuildItem(), this.createAnalysisParentItem()];
    }

    if (element.label === this.ANALYSIS_LABEL) {
      // Return the child items under "Analyzis"
      return [
        this.createCommandItem(this.DASHBOARD_LABEL, COMMANDS.OPEN_DASHBOARD),
        this.createCommandItem(this.BUILD_ANALYZER_LABEL, COMMANDS.OPEN_BUILD_ANALYZER),
      ];
    }

    return [];
  }

  /**
   * Creates the "Select a Build" item that triggers the "select-build" command.
   * @returns A TreeItem representing the "Select a Build" element.
   */
  private createSelectBuildItem(): vscode.TreeItem {
    const selectBuildItem = new vscode.TreeItem(
      this.SELECT_BUILD_LABEL,
      vscode.TreeItemCollapsibleState.None,
    );
    selectBuildItem.tooltip = this.SELECT_BUILD_TOOLTIP;
    selectBuildItem.iconPath = this.SELECT_BUILD_ICON;
    selectBuildItem.command = {
      command: COMMANDS.SELECT_BUILD,
      title: this.SELECT_BUILD_LABEL,
    };
    return selectBuildItem;
  }

  /**
   * Creates the parent item labeled "Analyzis" with a collapsible state and icon.
   * This parent node will house the child command nodes.
   * @returns A TreeItem representing the "Analyzis" parent element.
   */
  private createAnalysisParentItem(): vscode.TreeItem {
    const parentItem = new vscode.TreeItem(
      this.ANALYSIS_LABEL,
      vscode.TreeItemCollapsibleState.Expanded,
    );
    parentItem.iconPath = this.ANALYSIS_ICON;
    return parentItem;
  }

  /**
   * Creates a TreeItem for a specific command that will be executed
   * when the user selects the item in the view.
   * @param label The label displayed for the command item.
   * @param command The command ID associated with the item.
   * @returns A TreeItem representing the command in the view.
   */
  private createCommandItem(label: string, command: string): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
    treeItem.command = { command, title: label };
    return treeItem;
  }
}
