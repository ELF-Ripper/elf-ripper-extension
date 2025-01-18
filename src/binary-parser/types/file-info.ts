import * as vscode from "vscode";

/**
 * Represents information about a file (metadata).
 */
export interface FileInfo {
  fileUri?: vscode.Uri;
  filePath?: string;
  fileName?: string;
  fileContent?: Buffer;
}
