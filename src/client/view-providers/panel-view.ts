import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { webviewManager } from "../managers/webview";

// Constants for public directory and file paths
const PUBLIC_DIR = path.join(__dirname, "public");
const PANEL_HTML = path.join(PUBLIC_DIR, "panel.html");
const PANEL_BUNDLE = path.join(PUBLIC_DIR, "panel.bundle.js");

/**
 * PanelViewProvider is responsible for providing the content and functionality
 * for the Build Analyzer panel view within extension.
 */
export class PanelViewProvider implements vscode.WebviewViewProvider {
  /**
   * Resolves the webview view, configuring its options, setting the HTML content,
   * and registering the webview with the WebviewManager.
   * @param {vscode.WebviewView} webviewView - The webview view being resolved.
   */
  resolveWebviewView(webviewView: vscode.WebviewView) {
    // Configure webview options to allow scripts and restrict resource access to the public directory
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(PUBLIC_DIR)],
    };

    // Set the initial HTML content for the webview
    webviewView.webview.html = getPanelHtml(webviewView.webview);

    // Register the panel view with the WebviewManager
    webviewManager.setPanelView(webviewView);
  }
}

/**
 * Retrieves and returns the HTML content for the panel webview, replacing
 * the script source with the correct URI for local resources.
 * @param {vscode.Webview} webview - The webview for which to generate the HTML content.
 * @returns {string} The HTML content for the panel webview.
 */
function getPanelHtml(webview: vscode.Webview): string {
  // Read the HTML template from the file
  let htmlContent = fs.readFileSync(PANEL_HTML, "utf8");

  // Generate the URI for the script bundle
  const scriptUri = webview.asWebviewUri(vscode.Uri.file(PANEL_BUNDLE));

  // Replace the script source in the HTML content with the correct webview URI
  return htmlContent.replace(
    '<script defer="defer" src="panel.bundle.js"></script>',
    `<script defer="defer" src="${scriptUri}"></script>`,
  );
}
