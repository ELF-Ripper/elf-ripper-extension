// Declare the acquireVsCodeApi function for TypeScript
declare function acquireVsCodeApi(): any;

let vscode: any = null;

export function getVSCodeApi() {
  if (!vscode) {
    // Ensures we only call acquireVsCodeApi once and reuse the reference
    vscode = acquireVsCodeApi();
  }
  return vscode;
}

export function postMessage(message: any) {
  const vsCodeApi = getVSCodeApi();
  vsCodeApi.postMessage(message);
}
