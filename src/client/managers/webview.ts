import * as vscode from "vscode";
import { COMMANDS } from "../commands/command-handler/constants";
import { Logger } from "../utils/logger";
import { ProcessedData } from "../../app/contexts/data-context";

/**
 * WebviewManager is a singleton class responsible for managing webviews:
 *      -> Editor Panel (Dashboard)
 *      -> Panel View (Build Analyzer)
 *
 * It handles communication, visibility changes, and data synchronization
 * between the extension and the webviews.
 */
class WebviewManager {
  private static instance: WebviewManager; // Singleton instance
  public dashboardPanel?: vscode.WebviewPanel; // Dashboard webview panel reference
  private panelView?: vscode.WebviewView; // Panel webview view reference
  private processedData: ProcessedData = null; // Cached processed data

  // Private constructor to enforce singleton pattern
  private constructor() {}

  /**
   * Returns the singleton instance of WebviewManager.
   * If the instance doesn't exist, it is created.
   * @returns {WebviewManager} The singleton instance.
   */
  public static getInstance(): WebviewManager {
    if (!WebviewManager.instance) {
      WebviewManager.instance = new WebviewManager();
    }
    return WebviewManager.instance;
  }

  /**
   * Registers the Dashboard webview panel and sets up message and visibility listeners.
   * Sends processed data to the dashboard if available.
   * @param {vscode.WebviewPanel} panel - The Dashboard webview panel.
   */
  public setDashboardPanel(panel: vscode.WebviewPanel) {
    this.dashboardPanel = panel;
    this.setupMessageHandler(panel.webview, "Dashboard");

    Logger.log("Dashboard panel initialized.", "info", "WebviewManager");

    // Register listeners for visibility changes and disposal
    panel.onDidChangeViewState(() => this.handleVisibilityChange(panel, "Dashboard"));
    panel.onDidDispose(() => this.clearWebviewReference("Dashboard"));
  }

  /**
   * Registers the Panel webview view and sets up message and visibility listeners.
   * @param {vscode.WebviewView} view - The Panel webview view.
   */
  public setPanelView(view: vscode.WebviewView) {
    this.panelView = view;
    this.setupMessageHandler(view.webview, "Panel");

    Logger.log("Panel view initialized.", "info", "WebviewManager");

    // Register listeners for visibility changes and disposal
    view.onDidChangeVisibility(() => this.handleVisibilityChange(view, "Panel"));
    view.onDidDispose(() => this.clearWebviewReference("Panel"));
  }

  /**
   * Sets the processed data and sends it to both the dashboard and panel webviews, if they are visible.
   * @param {ProcessedData} data - The processed data to be sent to the webviews.
   */
  public setProcessedData(data: ProcessedData) {
    this.processedData = data;
    Logger.log("Processed data set, sending to webviews.", "info", "WebviewManager");

    // Send processed data to both webviews
    if (this.dashboardPanel) {
      this.sendDataToWebview(this.dashboardPanel.webview, "Dashboard");
    }
    if (this.panelView) {
      this.sendDataToWebview(this.panelView.webview, "Panel");
    }
  }

  /**
   * Sends the processed data to the specified webview if it exists and data is available.
   * @param {vscode.Webview | undefined} webview - The webview to send data to.
   * @param {string} viewType - The type of webview (Dashboard or Panel).
   */
  private sendDataToWebview(webview: vscode.Webview | undefined, viewType: string) {
    if (webview && this.processedData) {
      webview.postMessage({ type: "data", data: this.processedData });
      Logger.log(`Sent data to ${viewType}.`, "info", "WebviewManager");
    }
  }

  /**
   * Handles visibility changes for the dashboard or panel webview.
   * @param {vscode.WebviewPanel | vscode.WebviewView} webviewContainer - The webview container.
   * @param {string} viewType - The type of webview (Dashboard or Panel).
   */
  private handleVisibilityChange(
    webviewContainer: vscode.WebviewPanel | vscode.WebviewView,
    viewType: string,
  ) {
    Logger.log(
      `${viewType} visibility changed. Visible: ${webviewContainer.visible}`,
      "info",
      "WebviewManager",
    );
  }

  /**
   * Clears the webview reference when it is disposed, logging the action.
   * @param {string} viewType - The type of webview (Dashboard or Panel) being disposed.
   */
  private clearWebviewReference(viewType: string) {
    Logger.log(`${viewType} disposed.`, "info", "WebviewManager");
    if (viewType === "Dashboard") {
      this.dashboardPanel = undefined;
    } else if (viewType === "Panel") {
      this.panelView = undefined;
    }
  }

  /**
   * Sets up message handling for a given webview, processing messages sent from the webview.
   * @param {vscode.Webview} webview - The webview to handle messages for.
   * @param {string} viewType - The type of webview (Dashboard or Panel).
   */
  private setupMessageHandler(webview: vscode.Webview, viewType: string) {
    webview.onDidReceiveMessage(async message => {
      Logger.log(`Received message from ${viewType}: ${message.type}`, "info", "WebviewManager");

      switch (message.type) {
        case "processFiles":
          Logger.log("Processing files...", "info", "WebviewManager");
          await vscode.commands.executeCommand(COMMANDS.PROCESS_FILES);
          break;

        case "requestData":
          Logger.log(`Handling requestData from ${viewType}`, "info", "WebviewManager");

          // Only send data to webviews that are initialized
          if (viewType === "Dashboard" && this.dashboardPanel && this.processedData) {
            Logger.log(`Sending cached data to Dashboard`, "info", "WebviewManager");
            this.sendDataToWebview(this.dashboardPanel.webview, "Dashboard");
          } else if (viewType === "Panel" && this.panelView && this.processedData) {
            Logger.log(`Sending cached data to Panel`, "info", "WebviewManager");
            this.sendDataToWebview(this.panelView.webview, "Panel");
          } else {
            Logger.log(
              `Tried to send the cached data to ${viewType}, but there's no data proccessed yet!`,
              "warning",
              "WebviewManager",
            );
          }
          break;

        default:
          Logger.log(`Unknown message type: ${message.type}`, "warning", "WebviewManager");
          break;
      }
    });
  }

  /**
   * Retrieves the current processed data stored in the WebviewManager.
   * @returns {ProcessedData | null} The currently stored processed data.
   */
  public getProcessedData(): ProcessedData | null {
    return this.processedData;
  }
}

export const webviewManager = WebviewManager.getInstance();
