import * as vscode from "vscode";
import { SETTINGS } from "./command-handler/constants";
import { uriToString } from "../utils/helper-functions";

/**
 * Command to set the execution path for the ELF Ripper extension.
 * Prompts the user to select how they want to input the path: by typing it or by using a file dialog.
 * Then, updates the extension configuration accordingly.
 */
export async function setExecutionPath() {
  const options = ["Type Path Manually", "Select Path via File Dialog"];
  const userChoice = await vscode.window.showQuickPick(options, {
    placeHolder: "How would you like to set the execution path?",
    ignoreFocusOut: true,
  });

  if (userChoice === "Type Path Manually") {
    await setPathManually();
  } else if (userChoice === "Select Path via File Dialog") {
    await selectPathViaDialog();
  } else {
    vscode.window.showWarningMessage("No option selected. Execution Path not updated.");
  }
}

/**
 * Prompts the user to type the execution path manually. This allows the use of variables like '${workspaceFolder}'.
 */
async function setPathManually() {
  const executionPath = await vscode.window.showInputBox({
    placeHolder: "Enter the execution path (e.g., ${workspaceFolder}/build or an absolute path)",
    ignoreFocusOut: true,
    validateInput: validatePathInput,
  });

  if (executionPath) {
    await updateExecutionPath(executionPath);
  } else {
    vscode.window.showWarningMessage("No path entered. Execution Path not updated.");
  }
}

/**
 * Prompts the user to select the execution path via a file dialog.
 */
async function selectPathViaDialog() {
  const selectedFolder = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: "Select Execution Path",
  });

  if (selectedFolder && selectedFolder.length > 0) {
    const executionPath = uriToString(selectedFolder[0]);
    await updateExecutionPath(executionPath);
  } else {
    vscode.window.showWarningMessage("No folder selected. Execution Path not updated.");
  }
}

/**
 * Updates the execution path in the VSCode settings and provides feedback to the user.
 * @param executionPath The execution path to set.
 */
async function updateExecutionPath(executionPath: string) {
  const config = vscode.workspace.getConfiguration(SETTINGS.PROPERTY);
  await config.update("executionPath", executionPath, vscode.ConfigurationTarget.Global);

  vscode.window.showInformationMessage(`Execution Path set to: ${executionPath}`);
}

/**
 * Validates the user input for the execution path.
 * @param input The path entered by the user.
 * @returns An error message if invalid, or null if valid.
 */
function validatePathInput(input: string): string | null {
  if (!input.trim()) {
    return "Path cannot be empty.";
  }
  // Further validation logic can be added here if needed
  return null;
}
