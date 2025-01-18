import * as vscode from "vscode";
import { EventEmitter } from "events";

import { Logger } from "../utils/logger";

/**
 * FolderWatcher is a singleton class responsible for watching changes in a specified folder.
 * It emits events when files within the folder are created or deleted, allowing other components
 * to react accordingly and keep in sync with the folder contents.
 * Also, triggers the ConfigurationManager to re-run the updateConfiguration method, ensuring the
 * plugin remains in sync.
 */
export class FolderWatcherSingleton extends EventEmitter {
  private static instance: FolderWatcherSingleton;
  private folderWatcher?: vscode.FileSystemWatcher;

  // Private constructor to enforce singleton pattern
  private constructor() {
    super();
  }

  /**
   * Retrieves the singleton instance of the FolderWatcher class.
   * @returns {FolderWatcherSingleton} The singleton instance of FolderWatcher.
   */
  public static getInstance(): FolderWatcherSingleton {
    if (!FolderWatcherSingleton.instance) {
      FolderWatcherSingleton.instance = new FolderWatcherSingleton();
    }
    return FolderWatcherSingleton.instance;
  }

  /**
   * Initializes the folder watcher for the specified folder path.
   * Watches for file creation and deletion events within the folder.
   *
   * @param folderPath - The path to the folder to watch.
   */
  public initializeWatcher(folderPath: string) {
    this.disposeWatcher(); // Clean up any existing watcher

    // Initialize the watcher for the folder
    this.folderWatcher = this.createWatcher(folderPath);

    // Log the folder being watched
    Logger.log(`Folder watcher initialized for folder: ${folderPath}`, "info", "FolderWatcher");
  }

  /**
   * Disposes the current folder watcher.
   * Stops monitoring for file changes within the folder.
   */
  public disposeWatcher() {
    this.folderWatcher?.dispose();
    this.folderWatcher = undefined;

    Logger.log("Folder watcher disposed.", "info", "FolderWatcher");
  }

  /**
   * Creates a folder watcher and sets up event handlers for file creation and deletion.
   *
   * @param folderPath - Path of the folder to watch.
   * @returns {vscode.FileSystemWatcher} The created folder watcher.
   */
  private createWatcher(folderPath: string): vscode.FileSystemWatcher {
    // Watch for all files within the folder and subfolders using a glob pattern
    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(folderPath, "**/*"),
    );

    // Emit events when files are created or deleted
    watcher.onDidCreate(uri => this.handleFileEvent("created", uri));
    watcher.onDidDelete(uri => this.handleFileEvent("deleted", uri));

    return watcher;
  }

  /**
   * Handles file events (creation, deletion) and emits corresponding events.
   *
   * @param eventType - The type of event ("created" or "deleted").
   * @param uri - The URI of the file that triggered the event.
   */
  private handleFileEvent(eventType: "created" | "deleted", uri: vscode.Uri) {
    Logger.log(`File ${eventType} in folder: ${uri.fsPath}`, "info", "FolderWatcher");

    // Emit an event with the type and file URI
    this.emit(eventType, uri);
  }
}

export const FolderWatcher = FolderWatcherSingleton.getInstance();
