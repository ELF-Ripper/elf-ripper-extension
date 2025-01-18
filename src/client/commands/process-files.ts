import * as vscode from "vscode";
import { parseElfAndMemory, getMetadataFromManager } from "../file-handling/file-operations";
import { DataProcessor } from "../data-processor";
import { ParsedObjects } from "../data-processor/types";
import { Logger } from "../utils/logger";
import { FileWatcher } from "../utils/file-watcher";
import { webviewManager } from "../managers/webview";

/**
 * Processes ELF and Memory files by parsing them, processing the data,
 * and sending the processed data to the dashboard and panel webviews.
 */
export async function processFiles() {
  try {
    // Retrieve ELF and Memory file metadata from the targeted files
    const { elfFileInfo, memoryFileInfo } = await getMetadataFromManager();

    // Parse ELF and memory files
    const parsedObjects: ParsedObjects = await parseElfAndMemory(
      elfFileInfo,
      memoryFileInfo || null,
    );

    // Initialize the DataProcessor with parsed objects
    const dataProcessor = new DataProcessor(parsedObjects);

    // Process the data and return the structured data object
    const processedData = dataProcessor.processData();

    // Set the processed data in the WebviewManager (which pushes it to all webviews)
    webviewManager.setProcessedData(processedData);

    // Log a success message with processed filenames
    Logger.log(
      `Data from ${elfFileInfo.fileName}${memoryFileInfo ? ` and ${memoryFileInfo.fileName}` : ""} processed successfully!`,
      "info",
      "Extension",
    );

    // Initialize file watchers for the ELF and Memory files
    FileWatcher.initializeWatchers(elfFileInfo.filePath, memoryFileInfo?.filePath);
  } catch (error) {
    // Log and display error message
    Logger.log(`Error processing files: ${error.message}`, "error", "Extension");
    vscode.window.showErrorMessage(`Error processing files: ${error.message}`);
  }
}
