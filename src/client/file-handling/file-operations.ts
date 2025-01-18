import * as vscode from "vscode";
import { FileInfo } from "../../binary-parser/types/file-info";
import { ParsedObjects } from "../data-processor/types";
import { getFileInfo } from "./get-file-info";
import { buildArtifactsManager } from "../managers/build-artifacts";
import { Main } from "../../binary-parser/main";

/**
 * Retrieves ELF and optional Memory file metadata from BuildArtifacts manager.
 * This component houses the targeted files
 * Throws a warning if path values are not defined.
 * @returns Promise that resolves to an object containing ELF and optionally Memory file information.
 */
export async function getMetadataFromManager(): Promise<{
  elfFileInfo: FileInfo;
  memoryFileInfo?: FileInfo;
}> {
  // Retrieve file paths from BuildArtifacts
  const elfFilePath = buildArtifactsManager.getPathToELF();
  const memoryFilePath = buildArtifactsManager.getPathToMap();

  // Notify user if ELF file path is not defined
  if (!elfFilePath) {
    vscode.window.showWarningMessage("ELF file path is mandatory. Please select one.");
    throw new Error("ELF file path is not defined.");
  }

  // Notify user if Memory file path is not defined
  if (!memoryFilePath) {
    vscode.window.showWarningMessage("Memory file path is not defined. Are you sure?");
  }

  // Return file information
  return {
    elfFileInfo: getFileInfo(elfFilePath),
    memoryFileInfo: memoryFilePath ? getFileInfo(memoryFilePath) : undefined,
  };
}

/**
 * Parses the selected ELF and memory files.
 * Uses the Main class of binary-parser component to initialize parsers for ELF and memory files,
 * parses them using appropriate methods, and returns parsed objects.
 * @param elfFile FileInfo object representing the ELF file.
 * @param memoryFile FileInfo object representing the memory file.
 * @returns Promise that resolves to parsed ELF and memory objects.
 */
export async function parseElfAndMemory(
  elfFile: FileInfo,
  memoryFile?: FileInfo,
): Promise<ParsedObjects> {
  const parser = new Main();
  const parsedObjects: ParsedObjects = {};

  // Parse ELF file using appropriate parser
  parsedObjects.elfObject = parser.parseElf(elfFile);
  parsedObjects.elfFileName = elfFile.fileName; // Populate elfFileName

  // Parse memory file based on its type (.ld or .map) if provided
  if (memoryFile) {
    if (memoryFile.filePath.endsWith(".ld")) {
      parsedObjects.memoryObject = parser.parseLinkerScript(memoryFile);
    } else if (memoryFile.filePath.endsWith(".map")) {
      parsedObjects.memoryObject = parser.parseMapFile(memoryFile);
    }
    parsedObjects.memoryFileName = memoryFile.fileName; // Populate memoryFileName
  }

  // Return parsed ELF and memory objects
  return parsedObjects;
}
