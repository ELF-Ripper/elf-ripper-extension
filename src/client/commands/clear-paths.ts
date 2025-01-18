import * as vscode from "vscode";
import { buildArtifactsManager } from "../managers/build-artifacts";

/**
 * Clears the ELF and/or Memory file paths in the Build Artifacts Manager.
 * By default, it clears both paths unless a specific context item is passed.
 *
 * @param {vscode.TreeItem} item - Optional TreeItem argument passed from the context menu to specify which path to clear.
 */
export async function clearPaths(item?: vscode.TreeItem) {
  // If the item is a TreeItem from the context menu, determine which path to clear
  if (item?.contextValue === "elfPath") {
    // Clear only the ELF file path
    buildArtifactsManager.clearPaths("ELF");
    vscode.window.showInformationMessage("ELF file path has been cleared.");
  } else if (item?.contextValue === "mapPath") {
    // Clear only the Memory file path
    buildArtifactsManager.clearPaths("MAP");
    vscode.window.showInformationMessage("Memory file path has been cleared.");
  } else {
    // Clear both ELF and Memory file paths (default behavior)
    buildArtifactsManager.clearPaths();
    vscode.window.showInformationMessage("ELF and Memory file paths have been cleared.");
  }
}
