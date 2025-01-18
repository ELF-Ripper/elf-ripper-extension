import * as vscode from "vscode";
import { configManager } from "../managers/config";

/**
 * Command to refresh the workspace view by resetting discovered files and re-processing
 * the provided execution path.
 * Identifying whether it's a file or directory, then searches for elf and map artifacts
 */
export async function refreshWorkspace() {
  try {
    // Reset discovered files
    configManager.setDiscoveredFiles(undefined);

    // Re-process the resolved execution path
    await configManager.processExecutionPath();
  } catch (error) {
    vscode.window.showErrorMessage("Failed to refresh workspace: " + error.message);
  }
}
