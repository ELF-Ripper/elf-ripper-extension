import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

import { Logger } from "./logger";
import { Header } from "../../binary-parser/parsers/elf/header";
import { MapFileParser } from "../../binary-parser/parsers/map-file";
import { getFileInfo } from "../file-handling/get-file-info";

/**
 * The FileDiscovery class is responsible for scanning a specified directory
 * to discover and validate ELF and Map files. It recursively searches through
 * directories, identifies valid ELF and Map files by parsing their content,
 * and returns their URIs for further use.
 */
export class FileDiscovery {
  private static readonly VALID_ELF_TYPES = [2, 3, 4]; // ET_EXEC, ET_DYN, ET_CORE

  /**
   * Searches the workspace folder for ELF and Map files by attempting to parse valid file types.
   * @param rootPath The root path of the workspace or directory.
   * @returns {Promise<{ elfFiles: vscode.Uri[], mapFiles: vscode.Uri[] }>} Validated ELF and Map files URIs.
   */
  public static async discoverFiles(
    rootPath: string,
  ): Promise<{ elfFiles: vscode.Uri[]; mapFiles: vscode.Uri[] }> {
    const elfFiles: vscode.Uri[] = [];
    const mapFiles: vscode.Uri[] = [];

    // Recursively search the directory for ELF and Map files
    await this.searchDirectory(rootPath, elfFiles, mapFiles);

    return { elfFiles, mapFiles };
  }

  /**
   * Recursively searches a directory for valid ELF and Map files by attempting to parse only relevant file types.
   * @param dirPath The path of the directory to search.
   * @param elfFiles Array to store discovered ELF file URIs.
   * @param mapFiles Array to store discovered Map file URIs.
   */
  private static async searchDirectory(
    dirPath: string,
    elfFiles: vscode.Uri[],
    mapFiles: vscode.Uri[],
  ) {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively search inside subdirectories
        await this.searchDirectory(fullPath, elfFiles, mapFiles);
      } else if (entry.isFile()) {
        // Validate files to check if they are ELF or Map files
        await this.validateFile(fullPath, elfFiles, mapFiles);
      }
    }
  }

  /**
   * Validates whether a file is a valid ELF or Map file by checking the file type and attempting to parse it.
   * Only files of types `ET_EXEC`, `ET_DYN`, and `ET_CORE` are considered valid ELF files.
   * @param filePath The path of the file to validate.
   * @param elfFiles Array to store discovered ELF file URIs.
   * @param mapFiles Array to store discovered Map file URIs.
   */
  private static async validateFile(
    filePath: string,
    elfFiles: vscode.Uri[],
    mapFiles: vscode.Uri[],
  ) {
    try {
      // Validate as ELF file
      const fileInfo = getFileInfo(filePath);
      const elfParser = new Header(fileInfo); // Use ELFHeaderParser to validate ELF
      const elfHeader = elfParser.parse(); // Parse the ELF header

      // Check if the ELF file is of type ET_EXEC, ET_DYN, or ET_CORE using the numeric values
      if (this.VALID_ELF_TYPES.includes(elfHeader.e_type)) {
        elfFiles.push(vscode.Uri.file(filePath)); // Add valid ELF file URI to the array
        Logger.log(`ELF file validated: ${filePath}`, "info", "FileDiscovery");
      }
    } catch (error) {
      try {
        // If it's not a valid ELF, try to validate as a Map file
        const fileInfo = getFileInfo(filePath);
        const mapParser = new MapFileParser(fileInfo); // Use MapFileParser for validation
        mapParser.parse(); // Throws if not valid Map file

        mapFiles.push(vscode.Uri.file(filePath)); // Add valid Map file URI to the array
        Logger.log(`Map file validated: ${filePath}`, "info", "FileDiscovery");
      } catch {
        // Neither ELF nor Map file, ignore it
      }
    }
  }
}
