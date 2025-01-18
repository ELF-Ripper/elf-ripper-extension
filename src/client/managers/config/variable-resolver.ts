import * as vscode from "vscode";
import * as path from "path";
import { Logger } from "../../utils/logger";

/**
 * Maps variable prefixes to their corresponding resolver functions.
 */
const resolverMap: Record<
  string,
  (originalString: string, match: string) => Promise<string | undefined>
> = {
  workspaceFolder: resolveWorkspaceFolder,
  command: resolveCommandVariable,
};

/**
 * Resolves a variable in the execution path string.
 * @param variable The variable to resolve (e.g., "workspaceFolder" or "command:commandId").
 * @param match The matched variable string from the input.
 * @param originalString The original execution path string.
 * @returns The resolved path or undefined if invalid.
 */
export async function resolveVariable(
  variable: string,
  match: string,
  originalString: string,
): Promise<string | undefined> {
  const prefix = variable.split(":")[0];
  const resolver = resolverMap[prefix];

  if (!resolver) {
    vscode.window.showErrorMessage(`Unsupported variable: ${variable}`);
    return logAndReturnUndefined(`Unsupported variable: ${variable}`);
  }

  // Ensure the variable is trimmed before passing it to the resolver
  const cleanVariable = variable.replace(/\}$/, "");

  return resolver(originalString, match);
}
/**
 * Resolves the ${workspaceFolder} variable.
 */
async function resolveWorkspaceFolder(
  originalString: string,
  match: string,
): Promise<string | undefined> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  return workspaceFolder && path.isAbsolute(workspaceFolder)
    ? path.resolve(originalString.replace(match, workspaceFolder))
    : logAndReturnUndefined("Invalid workspaceFolder.");
}

/**
 * Resolves the ${command:commandId} variable.
 */
async function resolveCommandVariable(
  originalString: string,
  match: string,
): Promise<string | undefined> {
  // Extract the command ID without the trailing }
  const commandId = match.slice(1, -1).split(":")[1]; // removes the first ${ and last }

  try {
    const result = await vscode.commands.executeCommand(commandId);
    console.log("Resolved Command:", result);

    return typeof result === "string" && path.isAbsolute(result)
      ? path.resolve(originalString.replace(match, result))
      : logAndReturnUndefined(`Command ${commandId} did not return a valid absolute path string.`);
  } catch (error) {
    return logAndReturnUndefined(`Error executing command ${commandId}: ${error.message}`);
  }
}

/**
 * Logs an error message and returns undefined.
 */
function logAndReturnUndefined(message: string): undefined {
  Logger.log(message, "error", "VariableResolver");
  return undefined;
}
