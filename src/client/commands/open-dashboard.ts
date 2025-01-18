import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { webviewManager } from "../managers/webview";

// Constants for public directory and file paths
const PUBLIC_DIR = path.join(__dirname, "public");
const DASHBOARD_HTML = path.join(PUBLIC_DIR, "dashboard.html");
const DASHBOARD_BUNDLE = path.join(PUBLIC_DIR, "dashboard.bundle.js");

/**
 * Opens the ELF Ripper Dashboard webview in the editor.
 * If the webview is already open, it focuses on the existing panel.
 * Otherwise, it creates a new webview panel.
 */
export async function openDashboard() {
  const columnToShowIn = vscode.window.activeTextEditor?.viewColumn;

  // Check if the Dashboard panel is already open
  if (webviewManager.dashboardPanel) {
    // Reveal the existing Dashboard panel
    webviewManager.dashboardPanel.reveal(columnToShowIn);
  } else {
    // Create a new webview panel for the Dashboard
    const panel = createDashboardPanel(columnToShowIn);

    // Set the webview's HTML content
    panel.webview.html = getDashboardHtml(panel.webview);

    // Register the panel with the WebviewManager
    webviewManager.setDashboardPanel(panel);
  }
}

/**
 * Creates a new webview panel for the ELF Ripper Dashboard.
 * @param {vscode.ViewColumn | undefined} columnToShowIn - The column in which to show the webview.
 * @returns {vscode.WebviewPanel} The created webview panel.
 */
function createDashboardPanel(columnToShowIn: vscode.ViewColumn | undefined): vscode.WebviewPanel {
  return vscode.window.createWebviewPanel(
    "Dashboard", // Panel type identifier
    "ELF Ripper Dashboard", // Title displayed to the user
    columnToShowIn || vscode.ViewColumn.One, // Column to show the webview in
    {
      enableScripts: true, // Allow JavaScript execution in the webview
      localResourceRoots: [vscode.Uri.file(PUBLIC_DIR)], // Restrict local resources to the public directory
      retainContextWhenHidden: true, // Retain webview state when hidden
    },
  );
}

/**
 * Generates and returns the HTML content for the dashboard webview.
 * Replaces the script source with the correct URI for local resources.
 * @param {vscode.Webview} webview - The webview for which to generate the HTML content.
 * @returns {string} The HTML content for the dashboard webview.
 */
function getDashboardHtml(webview: vscode.Webview): string {
  // Read the HTML template from the file
  let htmlContent = fs.readFileSync(DASHBOARD_HTML, "utf8");

  // Generate the URI for the script bundle
  const scriptUri = webview.asWebviewUri(vscode.Uri.file(DASHBOARD_BUNDLE));

  // Replace the script source in the HTML content with the correct webview URI
  return htmlContent.replace(
    '<script defer="defer" src="dashboard.bundle.js"></script>',
    `<script defer="defer" src="${scriptUri}"></script>`,
  );
}
