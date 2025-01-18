import * as vscode from "vscode";

import { Logger } from "../utils/logger";
import { COMMANDS } from "../commands/command-handler/constants";
import { buildArtifactsManager, BuildArtifact, BuildArtifacts } from "../managers/build-artifacts";
import { uriToString } from "../utils/helper-functions";

/**
 * Command to select a build.
 * Optionally, the command can accept an ELF or MAP file URI directly,
 * or a BuildArtifact object.
 * If no arguments are provided, the user will be prompted to select a build.
 *
 * @param elfUriOrBuildArtifact Optional URI of the ELF file or a BuildArtifact object.
 * @param mapUri Optional URI of the MAP file (if the first argument is an ELF URI).
 */
export async function selectBuild(
  elfUriOrBuildArtifact?: vscode.Uri | BuildArtifact,
  mapUri?: vscode.Uri,
) {
  if (elfUriOrBuildArtifact instanceof vscode.Uri || mapUri) {
    // Handle case where an ELF URI (and optionally MAP URI) are provided
    await handleBuildSelection(elfUriOrBuildArtifact as vscode.Uri, mapUri);
    return;
  } else if (elfUriOrBuildArtifact && elfUriOrBuildArtifact.elf) {
    // Handle case where a BuildArtifact object is provided
    await handleBuildSelection(elfUriOrBuildArtifact.elf, elfUriOrBuildArtifact.map);
    return;
  }

  // Otherwise, prompt the user to select a build
  const builds = buildArtifactsManager.getBuildArtifacts();

  if (Object.keys(builds).length === 0) {
    vscode.window.showErrorMessage("No builds are available.");
    return;
  }

  const selectedBuildPath = await promptUserToSelectBuild(builds);
  if (selectedBuildPath) {
    const selectedBuild = builds[selectedBuildPath];
    await handleBuildSelection(selectedBuild.elf, selectedBuild.map);
  }
}

/**
 * Prompts the user to select a build from the available builds.
 *
 * @param builds The object containing all available builds.
 * @returns The selected build path or undefined if the selection was canceled.
 */
async function promptUserToSelectBuild(builds: BuildArtifacts): Promise<string | undefined> {
  const buildItems: vscode.QuickPickItem[] = Object.keys(builds).map(buildPath => {
    const elfPath = uriToString(builds[buildPath].elf) || "No ELF file available";
    const mapPath = uriToString(builds[buildPath].map) || "No MAP file available";

    return {
      label: `📁 ${buildPath}`, // The build path or name
      description: `ELF Path: ${elfPath}`, // Displaying the ELF path with a label
      detail: `MAP Path: ${mapPath}`, // Displaying the MAP path with a label
    };
  });

  const selectedBuildItem = await vscode.window.showQuickPick<vscode.QuickPickItem>(buildItems, {
    placeHolder: "Select a targeted build",
    matchOnDescription: true, // Allow matching based on the description
    matchOnDetail: true, // Allow matching based on the detail
    ignoreFocusOut: false,
    title: `Available Builds: (${buildItems.length})`,
  });

  // Return the selected build path
  return selectedBuildItem ? selectedBuildItem.label.replace("📁 ", "") : undefined;
}

/**
 * Handles the selection of a build by setting the ELF and MAP paths.
 * Processes the targeted artifacts
 *
 * @param elfUri The URI of the ELF file.
 * @param mapUri The URI of the MAP file.
 */
async function handleBuildSelection(elfUri?: vscode.Uri, mapUri?: vscode.Uri) {
  if (elfUri) {
    buildArtifactsManager.setPathToMap(undefined); // Cleanup
    await vscode.commands.executeCommand(COMMANDS.SELECT_ELF_FILE, elfUri);
  } else {
    vscode.window.showWarningMessage("No ELF file found in the selected build.");
  }

  if (mapUri) {
    await vscode.commands.executeCommand(COMMANDS.SELECT_MEMORY_FILE, mapUri);
  } else {
    Logger.log("No MAP file found in the selected build.", "info", "Extension");
  }

  // Once ELF and Map artifacts are set as targets, process those files
  await vscode.commands.executeCommand(COMMANDS.PROCESS_FILES);
}
