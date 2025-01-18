import * as vscode from "vscode";

export const commands = {
  registerCommand: jest.fn(),
};

export const ViewColumn = {
  One: 1,
  Two: 2,
  Three: 3,
  Active: -1,
  Beside: -2,
};

export const window = {
  showInformationMessage: jest.fn(),
  createWebviewPanel: jest
    .fn()
    .mockImplementation((viewType: string, title: string, showOptions: any, options?: any) => {
      // Mock implementation here
      const panel = {
        title: "Mock Webview Panel",
        viewType,
        webview: {
          html: "",
          onDidReceiveMessage: jest.fn(),
          postMessage: jest.fn(),
          options: {},
        },
        show: jest.fn(),
        reveal: jest.fn(),
        dispose: jest.fn(),
      };
      return panel;
    }),
};

export interface ExtensionContextMock {
  subscriptions: { dispose: jest.Mock<void, []> }[];
  workspaceState: {
    get: jest.Mock<any, [string]>;
    update: jest.Mock<Thenable<void>, [string, any]>;
    keys: jest.Mock<readonly string[], []>;
  };
  globalState: vscode.Memento & {
    get: jest.Mock<any, [string]>;
    update: jest.Mock<void, [string, any]>;
    setKeysForSync: jest.Mock<void, [readonly string[]]>;
    keys: jest.Mock<readonly string[], []>;
  };
  secrets: any;
  extensionUri: any;
  extensionPath: string;
  environmentVariableCollection: any;
  asAbsolutePath: jest.Mock<string, [string]>;
  storageUri: any;
  storagePath: string;
  globalStorageUri: any;
  globalStoragePath: string;
  logUri: any;
  logPath: string;
  extensionMode: any;
  extension: vscode.Extension<any>;
}
export const extensionContext: ExtensionContextMock = {
  subscriptions: [],
  workspaceState: {
    get: jest.fn(),
    update: jest.fn(),
    keys: jest.fn().mockReturnValue([]),
  },
  globalState: {
    get: jest.fn(),
    update: jest.fn().mockResolvedValue(undefined),
    setKeysForSync: jest.fn(),
    keys: jest.fn().mockReturnValue([]),
  },
  secrets: {},
  extensionUri: jest.fn(),
  extensionPath: "extension/path",
  environmentVariableCollection: {},
  asAbsolutePath: jest.fn((relativePath: string) => {
    return "absolute/path/" + relativePath;
  }),
  storageUri: jest.fn(),
  storagePath: "storage/path",
  globalStorageUri: {
    file: jest.fn(),
    fsPath: "global/storage/path",
  },
  globalStoragePath: "global/storage/path",
  logUri: {
    file: jest.fn(),
    fsPath: "log/path",
  },
  logPath: "log/path",
  extensionMode: {},
  extension: {} as vscode.Extension<any>,
};

const vscodeMock = {
  commands,
  ViewColumn,
  window,
  ExtensionContext: extensionContext,
};

// Default export for the entire mocked vscode module
export default vscodeMock;
