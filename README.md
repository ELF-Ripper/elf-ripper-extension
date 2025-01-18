# ELF-Ripper

ELF-Ripper is a powerful Visual Studio Code extension designed for analyzing ELF files and firmware memory usage in embedded projects. It offers detailed insights into memory allocation and ELF file structure, helping developers optimize their firmware builds and debug memory-related issues.

## Table of Contents

1. [User Guide](#user-guide)
   - [Overview](#overview)
   - [Features](#features)
   - [Configuration & Usage](#configuration--usage)
2. [Developer Guide](#developer-guide)
   - [Getting Started](#getting-started)
   - [Project Structure](#project-structure)
   - [Running the Project](#running-the-project)
   - [Contributing](#contributing)
3. [Future Plans](#future-plans)
4. [Acknowledgments](#acknowledgments)
5. [License](#license)


## User Guide

### Overview

The ELF Ripper plugin integrates seamlessly with Visual Studio Code, providing tools for in-depth analysis of ELF and MAP files. It includes features similar to the Linux `readelf` tool and focuses on memory analysis, making it easier to understand how your code utilizes memory resources during firmware development.

### Features

- **Build Analyzer**: A panel integrated within VS Code that provides a detailed breakdown of memory allocation within the selected build.
- **Dashboard**: Combines the Build Analyzer with a "Readelf" feature, which offers similar functionality to the `readelf` Linux package, providing comprehensive details about the ELF file's structure.

### Configuration & Usage

1. **Configuration Provider (`elf-ripper.settings.configurationProvider`)**:

   - **Default**: Uses the specified execution path to find ELF and MAP files.
   - **CMake**: Integrates with the CMake Tools extension to automatically set the execution path based on the active CMake target.

2. **Execution Path (`elf-ripper.settings.executionPath`)**:

   - Specifies where the ELF Ripper will search for ELF and MAP files. Supports absolute paths, `${workspaceFolder}`, and dynamic paths using `${command:commandID}`.
   - **Note**: In "CMake" mode, this setting is ignored, as the plugin will automatically manage the execution path.

3. **Using the Plugin**:
   - **Default Mode**: Set the execution path manually to point to the directory containing the ELF and MAP files.
   - **CMake Mode**: Let the plugin automatically manage the execution path by following the active CMake target.
   - **Accessing the Build Analyzer and Dashboard**:
     - Open the Build Analyzer panel or Dashboard view within the VS Code interface to analyze the memory allocation and ELF structure of the selected build.

## Developer Guide

### Getting Started

#### Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Visual Studio Code](https://code.visualstudio.com/) with the [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension.

#### Setting Up the Development Environment

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/ELF-Ripper/elf-ripper-extension
   cd ELF-Ripper
   ```

2. **Open the Repository in VSCode:**

   Open VSCode and navigate to `File > Open Folder`, then select the cloned repository folder.

3. **Open the Dev Container:**

   Press `F1` in VSCode, then select `Dev Containers: Rebuild Without Cache and Reopen in Container`. This will build and open the container based on the provided `Dockerfile` and `devcontainer.json`.

### Project Structure

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

### Running the Project

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

### Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.
Please make sure to update tests as appropriate.

## Future Plans

- **Integration with Other Firmware Build Systems**: Support integration build systems beyond CMake.
- **Side-by-Side Build Comparison**: Compare different builds to analyze changes in memory allocation, code size, and other metrics.
- **UI Customizations**: Add more options for customizing the plugin’s user interface, including theme colors, text fonts, and sizes to enhance the visual experience.

## Acknowledgments

The **ELF-Ripper DevTeam** that worked collaboratively to bring this project to life:

- **[Simão Varela](https://github.com/SimaoPVarela):** Project Overseer, Team Leader/Manager – Idealized the project, oversaw development, and provided guidance to the team throughout the process.
- **[Hugo Costa](https://github.com/hmfcpt):** Full-Stack Developer – Contributed to both backend and frontend components, often the sole contributor to specific parts of the project.
- **[João Mendes](https://github.com/Mendes2099):** Front-End Developer – Focused exclusively on developing the project's frontend components, ensuring a seamless user experience.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
