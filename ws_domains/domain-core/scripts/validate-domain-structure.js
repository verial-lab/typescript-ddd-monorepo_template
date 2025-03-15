#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharedConfig = require('./config/shared-config');

/**
 * Domain Structure Configuration
 * Extends shared configuration with script-specific settings
 */
const CONFIG = {
  ...sharedConfig.domainStructure,
  filePatterns: sharedConfig.filePatterns,
  importRules: sharedConfig.importRules,
  dependencies: sharedConfig.dependencies,
};

class DomainValidator {
  constructor(domainPath, domainName) {
    this.domainPath = domainPath;
    this.domainName = domainName;
    this.errors = [];
  }

  /**
   * Validates the entire domain structure
   */
  validate() {
    this.validateRequiredFiles();
    this.validateNoExtraFiles();
    this.validateImports();

    if (this.errors.length > 0) {
      console.error('\nDomain validation failed!\n');
      console.error(`${this.domainName} validation failed:`);
      for (const error of this.errors) {
        console.error(`- ${error}`);
      }
      process.exit(1);
    }
  }

  /**
   * Validates required files exist
   */
  validateRequiredFiles() {
    // Check ubiquitous language file
    const ubiquitousLanguageFile = CONFIG.requiredFiles.ubiquitousLanguage(this.domainName);
    if (!fs.existsSync(path.join(this.domainPath, ubiquitousLanguageFile))) {
      this.errors.push(`Missing required file: ${ubiquitousLanguageFile}`);
    }

    // Check other required files
    for (const file of CONFIG.requiredFiles.other) {
      if (!fs.existsSync(path.join(this.domainPath, file))) {
        this.errors.push(`Missing required file: ${file}`);
      }
    }
  }

  /**
   * Validates no unauthorized files or directories exist
   */
  validateNoExtraFiles() {
    const allowedDirs = new Set(CONFIG.allowedDirectories);
    const allowedFiles = new Set([
      ...CONFIG.allowedFiles,
      ...CONFIG.requiredFiles.other,
      CONFIG.requiredFiles.ubiquitousLanguage(this.domainName),
    ]);

    const isIgnored = (itemPath) => {
      // Always ignore root level node_modules, dist, and .turbo directories
      if (['node_modules', 'dist', '.turbo'].includes(itemPath)) {
        return true;
      }

      return CONFIG.filePatterns.ignoreFiles.some((pattern) => {
        const regexPattern = pattern
          .replace(/\*\*/g, '.*')
          .replace(/\*/g, '[^/]*')
          .replace(/\?/g, '.')
          .replace(/\//g, `\\${path.sep}`);
        return new RegExp(regexPattern).test(itemPath);
      });
    };

    const checkPath = (currentPath, relativePath = '') => {
      // Skip checking this path if it matches ignore patterns
      if (isIgnored(relativePath)) {
        return;
      }

      const items = fs.readdirSync(currentPath);

      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const itemRelativePath = relativePath ? path.join(relativePath, item) : item;

        // Skip this item if it matches ignore patterns
        if (isIgnored(itemRelativePath)) {
          continue;
        }

        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Only check directory structure if it's not ignored
          if (!isIgnored(itemRelativePath) && !allowedDirs.has(itemRelativePath)) {
            this.errors.push(`Unauthorized directory found: ${itemRelativePath}`);
          }
          // Recursively check contents
          checkPath(fullPath, itemRelativePath);
        } else {
          // For files in src/, they must be in one of the allowed directories
          if (itemRelativePath.startsWith('src/')) {
            const parentDir = path.dirname(itemRelativePath);
            if (!allowedDirs.has(parentDir)) {
              // Special handling for test files
              const isTestFile = CONFIG.filePatterns.testFiles.some((pattern) => {
                const regexPattern = pattern
                  .replace(/\*\*/g, '.*')
                  .replace(/\*/g, '[^/]*')
                  .replace(/\?/g, '.');
                return new RegExp(regexPattern).test(item);
              });

              if (isTestFile) {
                const baseDir = parentDir.split('/').slice(0, 3).join('/');
                if (!allowedDirs.has(baseDir)) {
                  this.errors.push(`Test file found in unauthorized location: ${itemRelativePath}`);
                }
              } else {
                this.errors.push(`File found in unauthorized location: ${itemRelativePath}`);
              }
            }
          } else if (
            !allowedFiles.has(item) &&
            !CONFIG.filePatterns.testFiles.some((pattern) => {
              const regexPattern = pattern
                .replace(/\*\*/g, '.*')
                .replace(/\*/g, '[^/]*')
                .replace(/\?/g, '.');
              return new RegExp(regexPattern).test(item);
            })
          ) {
            this.errors.push(`Unauthorized file found: ${itemRelativePath}`);
          }
        }
      }
    };

    checkPath(this.domainPath);
  }

  /**
   * Validates imports across layers
   */
  validateImports() {
    const srcDir = path.join(this.domainPath, 'src');
    if (!fs.existsSync(srcDir)) {
      this.errors.push('Missing src directory');
      return;
    }

    const domainDir = path.join(srcDir, 'domain');
    const applicationDir = path.join(srcDir, 'application');
    const infrastructureDir = path.join(srcDir, 'infrastructure');

    // Check domain layer imports
    this.validateDomainImports(domainDir);

    // Check application layer imports
    this.validateApplicationImports(applicationDir);

    // Check infrastructure layer implements interfaces
    this.validateInfrastructureImplementations(infrastructureDir);
  }

  /**
   * Validates domain layer imports
   */
  validateDomainImports(domainDir) {
    const files = this.getTypeScriptFiles(domainDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const imports = this.extractImports(content);
      const isTestFile = CONFIG.filePatterns.testFiles.some((pattern) => {
        const regexPattern = pattern
          .replace(/\*\*/g, '.*')
          .replace(/\*/g, '[^/]*')
          .replace(/\?/g, '.');
        return new RegExp(regexPattern).test(file);
      });

      for (const imp of imports) {
        // Allow test-specific imports in test files
        if (isTestFile && CONFIG.filePatterns.testAllowedImports.includes(imp)) {
          continue;
        }

        // Only allow imports from domain-core or relative imports
        if (!imp.startsWith(CONFIG.dependencies.requiredDependency) && !imp.startsWith('.')) {
          this.errors.push(`Invalid import in domain layer: ${imp} in ${file}`);
        }
      }
    }
  }

  /**
   * Validates application layer imports
   */
  validateApplicationImports(applicationDir) {
    const files = this.getTypeScriptFiles(applicationDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const imports = this.extractImports(content);

      for (const imp of imports) {
        // Allow imports from domain layer, domain-core, or within the application layer
        if (
          !imp.startsWith('../domain') &&
          !imp.startsWith('../../domain') &&
          !imp.startsWith(CONFIG.dependencies.requiredDependency) &&
          !imp.startsWith('.') // Allow relative imports within application layer
        ) {
          this.errors.push(`Invalid import in application layer: ${imp} in ${file}`);
        }
      }
    }
  }

  /**
   * Validates infrastructure implementations
   */
  validateInfrastructureImplementations(infrastructureDir) {
    const files = this.getTypeScriptFiles(infrastructureDir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const filename = path.basename(file);

      // Skip validation for index files
      if (filename === 'index.ts') {
        continue;
      }

      // Check if class implements an interface from domain
      if (content.includes('class') && !content.includes('implements')) {
        this.errors.push(`Infrastructure class must implement domain interface: ${file}`);
      }

      // Verify interface import from domain
      if (!content.includes("from '../../domain/interfaces")) {
        this.errors.push(`Infrastructure must import interfaces from domain: ${file}`);
      }
    }
  }

  /**
   * Gets all TypeScript files in a directory recursively
   */
  getTypeScriptFiles(dir) {
    if (!fs.existsSync(dir)) {
      return [];
    }

    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);

      // Skip ignored files/directories based on patterns
      if (
        CONFIG.filePatterns.ignoreFiles.some((pattern) => {
          const regexPattern = pattern
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*')
            .replace(/\?/g, '.');
          return new RegExp(regexPattern).test(fullPath);
        })
      ) {
        continue;
      }

      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...this.getTypeScriptFiles(fullPath));
      } else if (
        item.endsWith('.ts') &&
        !CONFIG.filePatterns.testFiles.some((pattern) => {
          const regexPattern = pattern
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*')
            .replace(/\?/g, '.');
          return new RegExp(regexPattern).test(item);
        })
      ) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Extracts imports from TypeScript content
   */
  extractImports(content) {
    const imports = [];
    const importRegex = /from ['"]([^'"]+)['"]/g;
    let match = importRegex.exec(content);

    while (match !== null) {
      imports.push(match[1]);
      match = importRegex.exec(content);
    }

    return imports;
  }
}

// Run validation for each domain
const domainsDir = path.join(__dirname, '..', '..');
const domains = fs.readdirSync(domainsDir);

let hasErrors = false;
console.log('\nValidating domain packages...\n');

for (const domain of domains) {
  // Skip if not a directory
  const domainPath = path.join(domainsDir, domain);
  if (!fs.statSync(domainPath).isDirectory()) {
    continue;
  }

  // Check if it's a valid domain package by verifying package.json exists and checking its name
  const packageJsonPath = path.join(domainPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    continue;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    // Only validate packages that are part of the @repo-domains scope
    if (!packageJson.name?.startsWith('@repo-domains/')) {
      continue;
    }

    console.log(`Checking domain: ${domain}`);
    const validator = new DomainValidator(domainPath, domain);
    validator.validate();
    console.log(`✓ ${domain} validation passed\n`);
  } catch (error) {
    hasErrors = true;
    console.error(`\n✗ Error validating ${domain}:`, error);
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  console.log('All domain packages validated successfully! 🎉\n');
}
