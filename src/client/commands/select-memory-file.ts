import * as vscode from "vscode";
import { buildArtifactsManager } from "../managers/build-artifacts";

/**
 * Command to select a memory file.
 *
 * Sets the targeted Map file at Build Artifact Manager.
 * @param fileUriOrItem Optional URI of the file or TreeItem for programmatic selection.
 */
export async function selectMemoryFile(fileUriOrItem?: vscode.Uri | vscode.TreeItem) {
  if (!fileUriOrItem) {
    // User interaction: Prompt the user to select a memory file
    const uri = await vscode.window.showOpenDialog({
      title: "Select Memory File",
      openLabel: "Target",
      canSelectMany: false,
      canSelectFolders: false,
      filters: { "Supported files": ["map"], "All files": ["*"] },
    });

    if (uri && uri[0]) {
      buildArtifactsManager.setPathToMap(uri[0]);
    }
  } else if (fileUriOrItem instanceof vscode.Uri) {
    // Programmatic call with a URI
    buildArtifactsManager.setPathToMap(fileUriOrItem);
  } else if (fileUriOrItem instanceof vscode.TreeItem) {
    // Switch to user interaction mode if a TreeItem is passed
    await selectMemoryFile(); // Recursively call for user interaction path
  }
}
