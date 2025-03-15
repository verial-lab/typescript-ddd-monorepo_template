/**
 * Shared configuration for domain validation scripts
 */

const filePatterns = {
  // Source files to validate
  sourceFiles: '**/*.ts',
  // Test files to exclude from validation
  testFiles: ['**/*.test.ts', '**/*.spec.ts'],
  // Files to ignore completely
  ignoreFiles: ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/.*'],
  // Test file naming convention (from test-style-guide)
  testFileNaming: {
    pattern: '.test.ts', // Unit tests should be named with the same name, following .test.<ext>
    colocate: true, // Tests should be colocated with the files they test
  },
};

const importRules = {
  // Don't import from dist builds in typescript files (from no-dist-imports)
  noBuildImports: {
    pattern: /\/dist\//,
    message: 'Do not import from dist builds in TypeScript files. Import from the non-built files.',
  },
  // Only allow specific imports in test files
  testImports: {
    allowed: ['vitest'],
    message: 'Only specific testing libraries are allowed in test files.',
  },
};

const domainStructure = {
  // Required files that every domain must have
  requiredFiles: {
    // The ubiquitous language file is required and must follow the naming pattern
    ubiquitousLanguage: (domainName) => `UBIQUITOUS_LANGUAGE-${domainName}.md`,
    // Other required files
    other: ['package.json'],
  },

  // Optional but allowed files
  allowedFiles: [
    'tsconfig.json',
    'tsup.config.ts',
    'vitest.config.ts',
    'README.md',
    'tsconfig.tsbuildinfo',
    'validate-dependencies.js',
    'validate-domain-structure.js',
  ],

  // Required directory structure
  requiredDirectories: [
    ['domain', 'events'],
    ['domain', 'interfaces'],
    ['domain', 'models'],
    ['application', 'commands'],
    ['application', 'queries'],
    ['infrastructure'],
  ],

  // Allowed directory structure (includes required dirs plus optional ones)
  allowedDirectories: [
    'src',
    'src/domain',
    'src/domain/events',
    'src/domain/interfaces',
    'src/domain/interfaces/repositories',
    'src/domain/interfaces/services',
    'src/domain/models',
    'src/application',
    'src/application/commands',
    'src/application/queries',
    'src/infrastructure',
    'src/infrastructure/repositories',
    'src/infrastructure/services',
    'scripts',
  ],
};

const dependencies = {
  // Required dependencies for domain packages
  required: {
    domainCore: '@repo-domains/domain-core',
  },
};

module.exports = {
  filePatterns,
  importRules,
  domainStructure,
  dependencies,
};
