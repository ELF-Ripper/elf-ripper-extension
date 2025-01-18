import * as vscode from "vscode";
import { Logger } from "../utils/logger";

/**
 * Converts a string to a vscode.Uri object.
 * @param str The string to convert.
 * @returns The corresponding vscode.Uri object.
 */
export function stringToUri(str: string): vscode.Uri {
  return vscode.Uri.file(str);
}

/**
 * Converts a vscode.Uri object to a string.
 * @param uri The vscode.Uri object to convert.
 * @returns The corresponding string.
 */
export function uriToString(uri: vscode.Uri | undefined): string | undefined {
  return uri?.fsPath;
}

/**
 * Checks if the given URI is a file.
 * @param fileUri The URI of the file to check.
 * @returns A promise that resolves to true if the URI is a file, false otherwise.
 */
export async function isFile(fileUri: vscode.Uri): Promise<boolean> {
  try {
    const stat = await vscode.workspace.fs.stat(fileUri);

    return stat.type === vscode.FileType.File;
  } catch (err) {
    Logger.log(
      `Failed to determine if path is a file: ${fileUri.fsPath}, error: ${err.message}`,
      "warning",
    );

    return false;
  }
}

/**
 * Checks if the given URI is a directory.
 * @param dirUri The URI of the directory to check.
 * @returns A promise that resolves to true if the URI is a directory, false otherwise.
 */
export async function isDirectory(dirUri: vscode.Uri): Promise<boolean> {
  try {
    const stat = await vscode.workspace.fs.stat(dirUri);

    return stat.type === vscode.FileType.Directory;
  } catch (err) {
    Logger.log(
      `Failed to determine if path is a directory: ${dirUri.fsPath}, error: ${err.message}`,
      "warning",
    );

    return false;
  }
}
