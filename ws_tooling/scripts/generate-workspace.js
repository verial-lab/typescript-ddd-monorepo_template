#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Workspace types
const WORKSPACE_TYPES = {
  app: 'app',
  package: 'package',
  domain: 'domain',
};

// Template paths
const TEMPLATE_PATHS = {
  [WORKSPACE_TYPES.app]: path.join(__dirname, '../../ws_templates/app'),
  [WORKSPACE_TYPES.package]: path.join(__dirname, '../../ws_templates/package'),
  [WORKSPACE_TYPES.domain]: path.join(__dirname, '../../ws_templates/domain'),
};

// Workspace paths
const WORKSPACE_PATHS = {
  [WORKSPACE_TYPES.app]: path.join(__dirname, '../../ws_apps'),
  [WORKSPACE_TYPES.package]: path.join(__dirname, '../../ws_packages'),
  [WORKSPACE_TYPES.domain]: path.join(__dirname, '../../ws_domains'),
};

// Ask for workspace type
function askForWorkspaceType() {
  return new Promise((resolve) => {
    rl.question(
      `Select workspace type (${Object.values(WORKSPACE_TYPES).join('/')}): `,
      (answer) => {
        const type = answer.toLowerCase();
        if (Object.values(WORKSPACE_TYPES).includes(type)) {
          resolve(type);
        } else {
          console.error(
            `Invalid workspace type. Please choose from: ${Object.values(WORKSPACE_TYPES).join(', ')}`
          );
          resolve(askForWorkspaceType());
        }
      }
    );
  });
}

// Ask for workspace name
function askForWorkspaceName() {
  return new Promise((resolve) => {
    rl.question('Enter workspace name (e.g., "auth", "ui", "api"): ', (answer) => {
      if (answer && /^[a-z0-9-]+$/.test(answer)) {
        resolve(answer);
      } else {
        console.error('Invalid workspace name. Use lowercase letters, numbers, and hyphens only.');
        resolve(askForWorkspaceName());
      }
    });
  });
}

// Ask for workspace description
function askForWorkspaceDescription() {
  return new Promise((resolve) => {
    rl.question('Enter workspace description: ', (answer) => {
      resolve(answer || 'Generated workspace');
    });
  });
}

// Copy directory recursively
function copyDirectoryRecursively(source, destination, replacements) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Read source directory
  const files = fs.readdirSync(source);

  // Copy each file/directory
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);
    const stats = fs.statSync(sourcePath);

    if (stats.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectoryRecursively(sourcePath, destinationPath, replacements);
    } else {
      // Read and modify file content
      let content = fs.readFileSync(sourcePath, 'utf8');

      // Replace template placeholders
      for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g'), value);
      }

      // Write file with replaced content
      fs.writeFileSync(destinationPath, content);
    }
  }
}

// Main function
async function main() {
  try {
    // Get workspace information
    const type = await askForWorkspaceType();
    const name = await askForWorkspaceName();
    const description = await askForWorkspaceDescription();

    // Define paths
    const templatePath = TEMPLATE_PATHS[type];
    const workspacePath = path.join(WORKSPACE_PATHS[type], name);

    // Check if workspace already exists
    if (fs.existsSync(workspacePath)) {
      console.error(`Workspace '${name}' already exists in '${WORKSPACE_PATHS[type]}'`);
      process.exit(1);
    }

    // Prepare replacements
    const replacements = {
      name: `@monorepo/${name}`,
      description,
    };

    // Copy template files
    console.log(`Creating ${type} workspace '${name}'...`);
    copyDirectoryRecursively(templatePath, workspacePath, replacements);

    console.log(`Workspace created successfully at ${workspacePath}`);
    console.log('Installing dependencies...');

    // Install dependencies
    execSync('pnpm install', { stdio: 'inherit' });

    console.log('Done!');
  } catch (error) {
    console.error('Error creating workspace:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
