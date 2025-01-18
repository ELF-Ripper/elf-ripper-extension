import * as vscode from "vscode";
import { buildArtifactsManager } from "../managers/build-artifacts";

/**
 * Command to select an ELF file.
 *
 * Sets the targeted ELF file at Build Artifact Manager.
 * @param fileUriOrItem Optional URI of the file or TreeItem for programmatic selection.
 */
export async function selectElfFile(fileUriOrItem?: vscode.Uri | vscode.TreeItem) {
  if (!fileUriOrItem) {
    // User interaction: Prompt the user to select an ELF file
    const uri = await vscode.window.showOpenDialog({
      title: "Select ELF File",
      openLabel: "Target",
      canSelectMany: false,
      canSelectFolders: false,
      filters: { "Supported files": ["elf", "out", "o"], "All files": ["*"] },
    });

    if (uri && uri[0]) {
      buildArtifactsManager.setPathToELF(uri[0]);
    }
  } else if (fileUriOrItem instanceof vscode.Uri) {
    // Programmatic call with a URI
    buildArtifactsManager.setPathToELF(fileUriOrItem);
  } else if (fileUriOrItem instanceof vscode.TreeItem) {
    // Switch to user interaction mode if a TreeItem is passed
    await selectElfFile(); // Recursively call for user interaction path
  }
}
