#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/**
 * Dependency Configuration
 */
const CONFIG = {
  // Core domain that all other domains depend on
  coreDomain: 'domain-core',

  // Allowed dependency patterns
  allowedDependencies: {
    // All domains can depend on domain-core
    coreDependency: '@repo-domains/domain-core',
    // Domains can depend on other domains through their package name
    domainPattern: /^@repo-domains\//,
  },

  // Files to check for dependencies
  filesToCheck: ['package.json', 'tsconfig.json'],
};

class DependencyValidator {
  constructor() {
    this.errors = [];
    this.dependencies = new Map(); // domain -> Set of dependencies
  }

  /**
   * Validates dependencies for all domains
   */
  validate() {
    this.collectDependencies();
    this.validateCircularDependencies();
    this.validateCoreDependencies();

    if (this.errors.length > 0) {
      console.error('\nDependency validation failed!\n');
      for (const error of this.errors) {
        console.error(`- ${error}`);
      }
      process.exit(1);
    }
  }

  /**
   * Collects dependencies from package.json and tsconfig.json files
   */
  collectDependencies() {
    const domainsDir = path.join(__dirname, '..', '..');
    const domains = fs.readdirSync(domainsDir);

    for (const domain of domains) {
      const domainPath = path.join(domainsDir, domain);
      if (!fs.statSync(domainPath).isDirectory()) {
        continue;
      }

      const dependencies = new Set();
      this.dependencies.set(domain, dependencies);

      // Check package.json dependencies
      const packageJsonPath = path.join(domainPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        this.collectPackageJsonDependencies(domain, packageJson, dependencies);
      }

      // Check tsconfig.json references
      const tsconfigPath = path.join(domainPath, 'tsconfig.json');
      if (fs.existsSync(tsconfigPath)) {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        this.collectTsconfigDependencies(domain, tsconfig, dependencies);
      }
    }
  }

  /**
   * Collects dependencies from package.json
   */
  collectPackageJsonDependencies(domain, packageJson, dependencies) {
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.peerDependencies,
    };

    for (const dep of Object.keys(allDeps)) {
      if (CONFIG.allowedDependencies.domainPattern.test(dep)) {
        const depDomain = dep.replace('@repo-domains/', '');
        if (depDomain !== domain) {
          dependencies.add(depDomain);
        }
      }
    }
  }

  /**
   * Collects dependencies from tsconfig.json
   */
  collectTsconfigDependencies(domain, tsconfig, dependencies) {
    if (tsconfig.references) {
      for (const ref of tsconfig.references) {
        const refPath = ref.path;
        if (refPath.startsWith('../')) {
          const depDomain = refPath.split('/')[1];
          if (depDomain !== domain) {
            dependencies.add(depDomain);
          }
        }
      }
    }
  }

  /**
   * Validates there are no circular dependencies
   */
  validateCircularDependencies() {
    const visited = new Set();
    const recursionStack = new Set();

    const detectCircular = (domain, path = []) => {
      if (recursionStack.has(domain)) {
        const cycle = [...path.slice(path.indexOf(domain)), domain];
        this.errors.push(`Circular dependency detected: ${cycle.join(' -> ')}`);
        return;
      }

      if (visited.has(domain)) {
        return;
      }

      visited.add(domain);
      recursionStack.add(domain);
      path.push(domain);

      const deps = this.dependencies.get(domain) || new Set();
      for (const dep of deps) {
        detectCircular(dep, [...path]);
      }

      recursionStack.delete(domain);
    };

    for (const domain of this.dependencies.keys()) {
      detectCircular(domain);
    }
  }

  /**
   * Validates core domain dependencies
   */
  validateCoreDependencies() {
    // Core domain should not depend on other domains
    const coreDeps = this.dependencies.get(CONFIG.coreDomain);
    if (coreDeps && coreDeps.size > 0) {
      this.errors.push(`Core domain (${CONFIG.coreDomain}) should not depend on other domains`);
    }

    // All other domains should depend on core
    for (const [domain, deps] of this.dependencies.entries()) {
      if (domain !== CONFIG.coreDomain && !deps.has(CONFIG.coreDomain)) {
        this.errors.push(`Domain ${domain} must depend on ${CONFIG.coreDomain}`);
      }
    }
  }
}

// Run validation
const validator = new DependencyValidator();
validator.validate();
