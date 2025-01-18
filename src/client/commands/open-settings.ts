import * as vscode from "vscode";

/**
 * Handler function to open the settings for the ELF Ripper extension.
 */
export function openSettings() {
  vscode.commands.executeCommand(
    "workbench.action.openSettings",
    "@ext:ELF-Ripper-DevTeam.elf-ripper",
  );
}
