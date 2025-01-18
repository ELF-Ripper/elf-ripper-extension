import * as vscode from "vscode";

/**
 * Logger is a singleton class responsible for logging messages to a VSCode Output Channel.
 * The logger can be accessed globally throughout the extension, providing a centralized
 * way to log messages, warnings, and errors.
 *
 * Usage example:
 * Logger.log("Initialization started...", "info", "Extension");
 */
export class LoggerSingleton {
  // The OutputChannel used for logging messages
  private outputChannel: vscode.OutputChannel;

  // The single instance of Logger (Singleton)
  private static instance: LoggerSingleton;

  /**
   * Private constructor to prevent direct instantiation.
   * Initializes the VSCode Output Channel.
   */
  private constructor() {
    this.outputChannel = vscode.window.createOutputChannel("ELF Ripper");
  }

  /**
   * Returns the singleton instance of the Logger class.
   * If the instance does not exist, it is created.
   *
   * @returns {LoggerSingleton} The singleton instance of Logger.
   */
  public static getInstance(): LoggerSingleton {
    if (!LoggerSingleton.instance) {
      LoggerSingleton.instance = new LoggerSingleton();
    }
    return LoggerSingleton.instance;
  }

  /**
   * Logs a message to the Output Channel.
   * The message is timestamped and prefixed with the provided log level and an optional custom prefix.
   *
   * @param {string} message - The message to log.
   * @param {"info" | "warning" | "error"} [level="info"] - The severity level of the log.
   * @param {string} [prefix="Log"] - An optional prefix for the log entry.
   */
  public log(
    message: string,
    level: "info" | "warning" | "error" = "info",
    prefix: string = "Log",
  ) {
    const timestamp =
      new Date().toISOString().substr(11, 8) +
      "." +
      new Date().getMilliseconds().toString().padStart(3, "0");

    const logLevel = level === "error" ? "[ERROR]" : level === "warning" ? "[WARNING]" : "[INFO]";
    this.outputChannel.appendLine(`[${timestamp}] [${prefix}] ${logLevel} ${message}`);
  }

  /**
   * Logs an object to the Output Channel.
   * The object is serialized to a JSON string and logged with the same formatting as a standard message.
   *
   * @param {any} object - The object to log (will be serialized to JSON).
   * @param {"info" | "warning" | "error"} [level="info"] - The severity level of the log.
   * @param {string} [prefix="Log"] - An optional prefix for the log entry.
   */
  public logObject(
    object: any,
    level: "info" | "warning" | "error" = "info",
    prefix: string = "Log",
  ) {
    const jsonString = JSON.stringify(object, null, 2);
    this.log(jsonString, level, prefix);
  }

  /**
   * Shows the Output Channel in the VSCode UI.
   * This is useful if you want to bring the log output to the user's attention.
   */
  public show() {
    this.outputChannel.show();
  }
}

// Export the singleton instance of Logger to be used throughout the extension
export const Logger = LoggerSingleton.getInstance();
