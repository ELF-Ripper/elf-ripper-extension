// Base Properties
const SETTINGS_BASE = "elf-ripper.settings";
const COMMAND_BASE = "elf-ripper.command";

// View Container IDs
export const VIEWS_CONTAINERS = {
  PANEL: "pluginPanel",
  ACTIVITY_BAR: "pluginActivity",
};

// View IDs
export const VIEWS = {
  PANEL_VIEW: "elf-ripper-panel.view",
  MENU_VIEW: "activitybar-menu-view",
  WORKSPACE_VIEW: "activitybar-workspace-view",
  TARGET_VIEW: "activitybar-target-view",
};

// View Titles
export const VIEW_TITLES = {
  PANEL_TITLE: "Build Analyzer",
  ACTIVITY_BAR_TITLE: "Settings",
};

// Settings Properties
export const SETTINGS = {
  PROPERTY: SETTINGS_BASE,
  USE_MAP: `${SETTINGS_BASE}.useMap`,
  EXECUTION_PATH: `${SETTINGS_BASE}.executionPath`,
  USE_STATUS_BAR: `${SETTINGS_BASE}.useStatusBar`,
  CONFIG_PROVIDER: `${SETTINGS_BASE}.configurationProvider`,
  // Add more settings properties as needed
};

// Command IDs
export const COMMANDS = {
  ID: COMMAND_BASE,
  SELECT_ELF_FILE: `${COMMAND_BASE}.selectElfFile`,
  SELECT_MEMORY_FILE: `${COMMAND_BASE}.selectMemoryFile`,
  SELECT_BUILD: `${COMMAND_BASE}.selectBuild`,
  SET_EXECUTION_PATH: `${COMMAND_BASE}.setExecutionPath`,
  PROCESS_FILES: `${COMMAND_BASE}.processFiles`,
  OPEN_DASHBOARD: `${COMMAND_BASE}.openDashboard`,
  OPEN_BUILD_ANALYZER: `${VIEWS.PANEL_VIEW}.focus`,
  CLEAR_PATHS: `${COMMAND_BASE}.clearPaths`,
  REFRESH_WORKSPACE: `${COMMAND_BASE}.refreshWorkspace`,
  OPEN_SETTINGS: `${COMMAND_BASE}.openSettings`,
  OPEN_HELP: `${COMMAND_BASE}.openHelp`,
  // Add more command constants as needed
};
