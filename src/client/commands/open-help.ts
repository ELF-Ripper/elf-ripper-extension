import * as vscode from "vscode";

// Define the help links
const HELP_LINKS = [
  // {
  //   label: "Get Started with ELF Ripper...",
  //   description: "Visit the project documentation to learn how to use the ELF Ripper extension.",
  //   url: vscode.Uri.parse("https://example.com/docs"),
  // },
  {
    label: "Review ELF Ripper extension repository...",
    description: "Check out our GitHub repository to review issues, report bugs, and contribute.",
    url: vscode.Uri.parse("https://github.com/ELF-Ripper/elf-ripper-extension"),
  },
];

/**
 * Command handler for displaying help options.
 */
export async function openHelp() {
  // Display the quick pick menu
  const selection = await vscode.window.showQuickPick(HELP_LINKS, {
    placeHolder: "Select an option to open",
    canPickMany: false,
  });

  // If a selection is made, open the corresponding URL
  if (selection) {
    vscode.env.openExternal(selection.url);
  }
}
