#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const REPO_ROOT = path.resolve(__dirname, '../..');
const PACKAGES_TO_MOVE = [
  {
    from: 'ws_infrastructure/event-bus',
    to: 'ws_packages/i_event-bus',
    packageName: '@repo-packages/i_event-bus',
  },
  {
    from: 'ws_infrastructure/hash-service',
    to: 'ws_packages/i_hash-service',
    packageName: '@repo-packages/i_hash-service',
  },
  {
    from: 'ws_infrastructure/id-generator',
    to: 'ws_packages/i_id-generator',
    packageName: '@repo-packages/i_id-generator',
  },
  {
    from: 'ws_infrastructure/supabase',
    to: 'ws_packages/i_supabase',
    packageName: '@repo-packages/i_supabase',
  },
  {
    from: 'ws_packages/ui',
    to: 'ws_packages/ui_components',
    packageName: '@repo-packages/ui_components',
  },
  {
    from: 'ws_packages/logger',
    to: 'ws_packages/u_logger',
    packageName: '@repo-packages/u_logger',
  },
];

// Helper to check if a path exists
function pathExists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

// Helper to update package.json
function updatePackageJson(packagePath, newName) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  if (!pathExists(packageJsonPath)) {
    console.warn(`No package.json found in ${packagePath}`);
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  pkg.name = newName;
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

// Helper to move directory
function moveDirectory(from, to) {
  const fromPath = path.join(REPO_ROOT, from);
  const toPath = path.join(REPO_ROOT, to);

  if (!pathExists(fromPath)) {
    console.warn(`Source directory ${fromPath} does not exist`);
    return false;
  }

  if (pathExists(toPath)) {
    console.warn(`Target directory ${toPath} already exists`);
    return false;
  }

  // Create parent directory if it doesn't exist
  const parentDir = path.dirname(toPath);
  if (!pathExists(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  // Move the directory
  fs.renameSync(fromPath, toPath);
  return true;
}

// Helper to update imports in TypeScript files
function updateImports(directory, oldName, newName) {
  const updateImportsCmd = `find "${directory}" -type f -name "*.ts" -exec sed -i '' 's/${oldName}/${newName}/g' {} +`;
  try {
    execSync(updateImportsCmd, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error updating imports in ${directory}:`, error.message);
  }
}

// Main migration function
function migratePackages() {
  console.log('Starting package migration...\n');

  for (const pkg of PACKAGES_TO_MOVE) {
    console.log(`Migrating ${pkg.from} to ${pkg.to}...`);

    // Move the directory
    if (moveDirectory(pkg.from, pkg.to)) {
      // Update package.json
      updatePackageJson(path.join(REPO_ROOT, pkg.to), pkg.packageName);

      // Update imports in all TypeScript files
      const oldImportPath = pkg.from.replace('ws_', '@repo-');
      const newImportPath = pkg.to.replace('ws_', '@repo-');
      updateImports(REPO_ROOT, oldImportPath, newImportPath);

      console.log(`✓ Successfully migrated ${pkg.from}\n`);
    } else {
      console.log(`× Failed to migrate ${pkg.from}\n`);
    }
  }

  // Clean up empty ws_infrastructure directory if it exists
  const infraDir = path.join(REPO_ROOT, 'ws_infrastructure');
  if (pathExists(infraDir) && fs.readdirSync(infraDir).length === 0) {
    fs.rmdirSync(infraDir);
    console.log('Removed empty ws_infrastructure directory');
  }

  console.log('\nMigration complete!');
  console.log('\nNext steps:');
  console.log('1. Review changes in Git');
  console.log('2. Update any remaining import references');
  console.log('3. Run tests to verify everything works');
  console.log('4. Commit changes');
}

// Run the migration
migratePackages();
