# Developer Guide

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Visual Studio Code](https://code.visualstudio.com/) with the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.

### Setting Up the Development Environment

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/ELF-Ripper/elf-ripper-extension
   cd ELF-Ripper
   ```

2. **Open the Repository in VSCode:**

   Open VSCode and navigate to `File > Open Folder`, then select the cloned repository folder.

3. **Open the Dev Container:**

   Press `F1` in VSCode, then select `Dev Containers: Rebuild Without Cache and Reopen in Container`. This will build and open the container based on the provided `Dockerfile` and `devcontainer.json`.

## Project Structure

```
📁 Root
├── 📁 .devcontainer                        # Dockerfile and devcontainer.json
├── 📁 .vscode                              # VS Code configuration files
├── 📁 dist                                 # Compiled output
├── 📁 node_modules
├── 📁 out                                  # Output directory
├── 📁 src
│ ├── 📁 app                                # React app components (webviews, UI components)
│ ├── 📁 binary-parser                      # Parser for ".elf", ".ld", and ".map" files
│ ├── 📁 client                             # VS Code plugin logic and client-side utilities
│ │ ├── 📁 commands                         # Command handlers for VS Code commands
│ │ ├── 📁 data-processor                   # Processing and formatting of parsed data
│ │ ├── 📁 file-handling                    # Utilities for managing file interactions
│ │ ├── 📁 managers                         # Components Managers
│ │ ├── 📁 utils                            # General utility functions
│ │ └── 📁 view-providers                   # VS Code view providers (e.g., for Webview panels)
│ │ └── 📄 extension.ts                     # Plugin entry point
├── 📁 test                                 # Tests for all components
├── 📄 package.json
└── other config files
```

## Running the Project

To work with the project:

- **Inside the Dev Container:** Use the following commands:

  - **Install dependencies:**

    ```sh
    npm install
    ```

  - **Build for Production:**

    ```sh
    npm run build
    ```

  - **Clean the build directories:**

    ```sh
    npm run clean
    ```

  - **Clean all dependencies and cache:**

    ```sh
    npm run clean:all
    ```

  - **Run tests:**

    ```sh
    npm test
    ```

  For development and debugging, use F5 to run and debug the extension in the VS Code environment.