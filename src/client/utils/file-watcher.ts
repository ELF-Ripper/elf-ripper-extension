import * as vscode from "vscode";

import { Logger } from "../utils/logger";
import { COMMANDS } from "../commands/command-handler/constants";

/**
 * FileWatcher is a singleton class responsible for watching changes
 * to ELF and Memory files. It triggers actions such as reprocessing the files
 * or clearing paths when files are modified or deleted.
 */
export class FileWatcherSingleton {
  private static instance: FileWatcherSingleton;
  private elfFileWatcher?: vscode.FileSystemWatcher;
  private memoryFileWatcher?: vscode.FileSystemWatcher;

  // Private constructor to enforce singleton pattern
  private constructor() {}

  /**
   * Retrieves the singleton instance of the FileWatcher class.
   * @returns {FileWatcherSingleton} The singleton instance of FileWatcher.
   */
  public static getInstance(): FileWatcherSingleton {
    if (!FileWatcherSingleton.instance) {
      FileWatcherSingleton.instance = new FileWatcherSingleton();
    }
    return FileWatcherSingleton.instance;
  }

  /**
   * Initializes file watchers for the provided ELF and Memory files.
   * Watches for file modifications and deletions. If either event occurs, appropriate
   * commands are triggered such as processing files or clearing paths.
   *
   * @param elfFilePath - The path to the ELF file to watch.
   * @param memoryFilePath - The path to the Memory file to watch (optional).
   */
  public initializeWatchers(elfFilePath: string, memoryFilePath?: string) {
    this.disposeWatchers(); // Clean up any existing watchers

    // Initialize the watcher for the ELF file
    this.elfFileWatcher = this.createWatcher(elfFilePath, "ELF");

    // Log the ELF file being watched
    Logger.log(`File watcher initialized for ELF file: ${elfFilePath}`, "info", "FileWatcher");

    // Initialize the watcher for the Memory file, if provided
    if (memoryFilePath) {
      this.memoryFileWatcher = this.createWatcher(memoryFilePath, "Memory");

      // Log the Memory file being watched
      Logger.log(
        `File watcher initialized for Memory file: ${memoryFilePath}`,
        "info",
        "FileWatcher",
      );
    } else {
      // Log that only the ELF file is being watched
      Logger.log("No Memory file provided, only ELF file is being watched.", "info", "FileWatcher");
    }
  }
  /**
   * Disposes the current file watchers for both ELF and Memory files.
   * Stops monitoring for file changes and deletes.
   */
  public disposeWatchers() {
    this.elfFileWatcher?.dispose();
    this.memoryFileWatcher?.dispose();

    this.elfFileWatcher = undefined;
    this.memoryFileWatcher = undefined;

    Logger.log("File watchers disposed.", "info", "FileWatcher");
  }

  /**
   * Creates a file watcher for the specified file and sets up event handlers
   * for changes and deletions.
   *
   * @param filePath - Path of the file to watch.
   * @param fileType - Type of the file ("ELF" or "Memory").
   * @returns {vscode.FileSystemWatcher} The created file watcher.
   */
  private createWatcher(filePath: string, fileType: "ELF" | "Memory"): vscode.FileSystemWatcher {
    const watcher = vscode.workspace.createFileSystemWatcher(filePath);

    watcher.onDidChange(() => this.handleFileChange(fileType));
    watcher.onDidDelete(() => this.handleFileDelete(fileType));

    return watcher;
  }

  /**
   * Handles the file change event by triggering the process-files command.
   *
   * @param fileType - Type of the file that was modified ("ELF" or "Memory").
   */
  private handleFileChange(fileType: "ELF" | "Memory") {
    Logger.log(`${fileType} file modified, triggering process-files.`, "info", "FileWatcher");
    vscode.commands.executeCommand(COMMANDS.PROCESS_FILES);
  }

  /**
   * Handles the file delete event by disposing the watcher and clearing the file paths.
   *
   * @param fileType - Type of the file that was deleted ("ELF" or "Memory").
   */
  private handleFileDelete(fileType: "ELF" | "Memory") {
    Logger.log(
      `${fileType} file deleted, stopping watcher and clearing paths.`,
      "info",
      "FileWatcher",
    );
    this.disposeWatchers(); // Stop watching the files

    // Trigger the command to clear the ELF/Memory paths
    vscode.commands.executeCommand(COMMANDS.CLEAR_PATHS);
  }
}

export const FileWatcher = FileWatcherSingleton.getInstance();
