import * as vscode from "vscode";
import { VIEWS } from "../commands/command-handler/constants";
import { PanelViewProvider } from "./panel-view";
import { MenuViewProvider } from "./menu-view";
import { TargetViewProvider } from "./target.view";
import { WorkspaceViewProvider } from "./workspace-view";

/**
 * Register the view providers for the extension.
 * @param context - The extension context provided by VS Code.
 */
export function registerViewProviders(context: vscode.ExtensionContext) {
  // Register the webview view provider for the Panel
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(VIEWS.PANEL_VIEW, new PanelViewProvider()),
  );

  // Register the tree data providers for the ActivityBar
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(VIEWS.MENU_VIEW, new MenuViewProvider()),
  );

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(VIEWS.TARGET_VIEW, new TargetViewProvider()),
  );

  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(VIEWS.WORKSPACE_VIEW, new WorkspaceViewProvider()),
  );
}
