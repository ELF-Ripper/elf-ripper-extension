import * as vscode from "vscode";
import { COMMANDS } from "./constants";

import { selectElfFile } from "../select-elf-file";
import { selectMemoryFile } from "../select-memory-file";
import { processFiles } from "../process-files";
import { openDashboard } from "../open-dashboard";
import { clearPaths } from "../clear-paths";
import { openSettings } from "../open-settings";
import { openHelp } from "../open-help";
import { selectBuild } from "../select-build";
import { setExecutionPath } from "../set-execution-path";
import { refreshWorkspace } from "../refresh-workspace";
// Import other command handlers as needed

/**
 * Registers the commands for the extension with the VS Code command registry.
 *
 * This function maps command IDs to their respective handler functions and registers
 * them with the VS Code command registry. It ensures that each command is associated
 * with the correct implementation, allowing the commands to be executed when invoked
 * by the user or other parts of the extension.
 *
 * @param context - The extension context provided by VS Code. This context is used
 *                  to manage the lifecycle of commands, including their disposal.
 */
export function registerCommands(context: vscode.ExtensionContext) {
  const commandModules = [
    { id: COMMANDS.SELECT_ELF_FILE, handler: selectElfFile },
    { id: COMMANDS.SELECT_MEMORY_FILE, handler: selectMemoryFile },
    { id: COMMANDS.SELECT_BUILD, handler: selectBuild },
    { id: COMMANDS.SET_EXECUTION_PATH, handler: setExecutionPath },
    { id: COMMANDS.PROCESS_FILES, handler: processFiles },
    { id: COMMANDS.OPEN_DASHBOARD, handler: openDashboard },
    { id: COMMANDS.CLEAR_PATHS, handler: clearPaths },
    { id: COMMANDS.REFRESH_WORKSPACE, handler: refreshWorkspace },
    { id: COMMANDS.OPEN_SETTINGS, handler: openSettings },
    { id: COMMANDS.OPEN_HELP, handler: openHelp },
    // Add more commands as needed
    ,
  ];

  commandModules.forEach(({ id, handler }) => {
    context.subscriptions.push(vscode.commands.registerCommand(id, handler));
  });
}
