# User Guide

## Overview

The ELF Ripper plugin integrates seamlessly with Visual Studio Code, providing tools for in-depth analysis of ELF and MAP files. It includes features similar to the Linux `readelf` tool and focuses on memory analysis, making it easier to understand how your code utilizes memory resources during firmware development.

## Features

- **Build Analyzer**: 
  - A comprehensive panel integrated within Visual Studio Code that replicates the "Build Analyzer" tool from STM Cube IDE.
  - Provides a detailed breakdown of memory allocation within the selected build.
  - Features a tree view within a table layout for intuitive navigation and visualization of memory usage.
  - Includes a search bar for easy access to specific memory allocations and components.
  - Supports both ascending and descending ordering of memory items for better analysis.
  - Displays a progress bar to indicate memory usage, helping users quickly assess memory allocation efficiency.
  - Offers additional functionalities to enhance the user's experience while analyzing builds.

- **Dashboard**:
  - An editor panel that consolidates all data from ELF analysis, similar to various commands of the `readelf` tool.
  - Organizes the analysis results into tables for easy interpretation and comparison.
  - Displays comprehensive details about the ELF file's structure, allowing developers to understand how their code utilizes memory resources during firmware development.
  - Provides visualizations that facilitate a better understanding of memory allocation and ELF file organization.

- **CMake Tools Integration**:
  - Automatically sets the execution path based on the active CMake build target, streamlining the workflow for developers using CMake.
  - Searches for and sets the specific ELF and MAP artifacts for the selected build, ensuring accurate analysis.
  - Remains in sync with regenerated artifacts, updating the execution path and targets automatically, which enhances the development experience by reducing manual configuration efforts.
  
## Configuration & Usage

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
