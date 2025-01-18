import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { FileInfo } from "../../binary-parser/types/file-info";
import { stringToUri, uriToString } from "../utils/helper-functions";

/**
 * Retrieves information about a file given its path or Uri.
 * This function handles both string paths and Uri objects, converting them
 * as necessary to gather details about the file, including its URI, path,
 * name, and content.
 *
 * @param filePathOrUri The path of the file as a string or a Uri.
 * @returns A FileInfo object with details about the file.
 */
export function getFileInfo(filePathOrUri: string | vscode.Uri): FileInfo {
  // Convert the input to a vscode.Uri if it's a string, or use it directly if it's already a Uri
  const fileUri: vscode.Uri =
    typeof filePathOrUri === "string" ? stringToUri(filePathOrUri) : filePathOrUri;

  // Convert the Uri back to a string path for file system operations
  const filePath: string = uriToString(fileUri)!;

  // Extract the filename from the file path
  const fileName = path.basename(filePath);

  // Read the content of the file as a Buffer
  const fileContent = fs.readFileSync(filePath);

  // Return a FileInfo object containing all gathered information
  return {
    fileUri,
    filePath,
    fileName,
    fileContent,
  };
}
