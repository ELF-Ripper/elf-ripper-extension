import * as vscode from "vscode";

import { Logger } from "../../utils/logger";
import { configManager } from ".";
import { StatusBarManager } from "../status-bar-item";
import { SETTINGS } from "../../commands/command-handler/constants";

/**
 * Registers a listener for configuration changes in the VSCode settings.
 * It updates the configuration manager and manages the StatusBarManager instance.
 * @param statusBarManager The StatusBarManager instance to control.
 */
export function registerConfigurationChangeListener(statusBarManager: StatusBarManager) {
  vscode.workspace.onDidChangeConfiguration(async event => {
    // Check if the relevant configurations have changed
    if (
      event.affectsConfiguration(SETTINGS.USE_MAP) ||
      event.affectsConfiguration(SETTINGS.EXECUTION_PATH) ||
      event.affectsConfiguration(SETTINGS.USE_STATUS_BAR) ||
      event.affectsConfiguration(SETTINGS.CONFIG_PROVIDER)
    ) {
      Logger.log(
        "Configuration change detected. Updating configuration...",
        "info",
        "ConfigurationManager",
      );

      // Refresh the configuration settings in the ConfigurationManager
      await configManager.updateConfiguration();

      // Update StatusBarManager based on the new configuration
      statusBarManager.onConfigurationChanged();
    }
  });
}
