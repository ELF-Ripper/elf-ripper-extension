import * as vscode from "vscode";

import { Logger } from "./utils/logger";
import { StatusBarManager } from "./managers/status-bar-item";
import { registerConfigurationChangeListener } from "./managers/config/listener";
import { registerViewProviders } from "./view-providers";
import { registerCommands } from "./commands/command-handler";

/**
 * Activate the extension. This function is called when the extension is activated.
 * @param context - The extension context provided by VS Code.
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "elf-ripper" is now active!');

  // Instantiate StatusBarManager
  const statusBarManager = new StatusBarManager();
  context.subscriptions.push(statusBarManager);

  // Register configuration change listener with StatusBarManager instance
  registerConfigurationChangeListener(statusBarManager);

  // Register view providers
  registerViewProviders(context);

  // Register commands
  registerCommands(context);

  Logger.log("Activated successfully.", "info", "Extension");
}

/**
 * Deactivate the extension. This function is called when the extension is deactivated.
 */
export function deactivate() {
  Logger.log("ELF Ripper deactivated.", "info", "Extension");
}
