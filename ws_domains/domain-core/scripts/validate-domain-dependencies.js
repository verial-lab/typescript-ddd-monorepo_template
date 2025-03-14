#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper to read and parse JSON file
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    process.exit(1);
  }
}

// Get required dependency info from domain-core's package.json
function getRequiredDependency() {
  const domainCorePath = path.join(__dirname, '..', 'package.json');
  const domainCorePackage = readJsonFile(domainCorePath);
  return {
    name: domainCorePackage.name,
    version: 'workspace:*',
  };
}

// Constants
const { name: REQUIRED_DEPENDENCY, version: REQUIRED_VERSION } = getRequiredDependency();

// Get workspace patterns from pnpm-workspace.yaml
function getWorkspacePatterns() {
  try {
    const workspaceConfig = fs.readFileSync(
      path.join(process.cwd(), '../../pnpm-workspace.yaml'),
      'utf8'
    );
    const packagesMatch = workspaceConfig.match(/packages:\s*\n((\s*-\s*"[^"]+"\s*\n)*)/);
    if (!packagesMatch) {
      throw new Error('No packages found in pnpm-workspace.yaml');
    }
    return packagesMatch[1]
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.match(/-\s*"([^"]+)"/)[1]);
  } catch (error) {
    console.error('Error reading workspace configuration:', error.message);
    process.exit(1);
  }
}

// Find domain package.json files (excluding domain-core)
function findPackageJsonFiles(_patterns) {
  try {
    const rootDir = path.join(process.cwd(), '../..');
    const domainsDir = path.join(rootDir, 'ws_domains');
    const command = `find ${domainsDir} -name "package.json"`;
    const result = execSync(command, { encoding: 'utf8' });

    return result
      .split('\n')
      .filter(Boolean)
      .filter((file) => !file.includes('node_modules'))
      .filter((file) => !file.includes('domain-core')); // Exclude domain-core
  } catch (error) {
    console.error('Error finding package.json files:', error.message);
    process.exit(1);
  }
}

// Validate dependencies in a package.json
function validateDependencies(packagePath) {
  const pkg = readJsonFile(packagePath);

  const dependencies = pkg.dependencies || {};
  const depEntries = Object.entries(dependencies);

  if (depEntries.length !== 1) {
    console.error(`\nError in ${packagePath}:`);
    console.error('Dependencies must contain exactly one entry:');
    console.error(`  "@repo-domains/domain-core": "workspace:*"`);
    console.error('Found:', JSON.stringify(dependencies, null, 2));
    return false;
  }

  const [depName, depVersion] = depEntries[0];

  if (depName !== REQUIRED_DEPENDENCY || depVersion !== REQUIRED_VERSION) {
    console.error(`\nError in ${packagePath}:`);
    console.error('Invalid dependency configuration. Expected:');
    console.error(`  "${REQUIRED_DEPENDENCY}": "${REQUIRED_VERSION}"`);
    console.error('Found:');
    console.error(`  "${depName}": "${depVersion}"`);
    return false;
  }

  return true;
}

// Main execution
function main() {
  const patterns = getWorkspacePatterns();
  const packageFiles = findPackageJsonFiles(patterns);
  let hasErrors = false;

  console.log('\nValidating domain dependencies...');
  console.log('Found domain packages:');
  for (const file of packageFiles) {
    console.log(`  - ${path.relative(process.cwd(), file)}`);
  }
  console.log('');

  for (const packagePath of packageFiles) {
    const relativePath = path.relative(process.cwd(), packagePath);
    console.log(`Checking ${relativePath}...`);
    if (!validateDependencies(packagePath)) {
      hasErrors = true;
    } else {
      console.log(`✓ ${relativePath} has correct dependencies\n`);
    }
  }

  if (hasErrors) {
    console.error('\nDependency validation failed. Please fix the errors above.');
    process.exit(1);
  }

  if (packageFiles.length === 0) {
    console.log('No domain packages found to validate.');
  } else {
    console.log('All domain packages have correct dependencies.');
  }
}

main();
