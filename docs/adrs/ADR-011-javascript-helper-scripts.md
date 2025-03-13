# ADR-011: JavaScript Helper Scripts for Cross-Platform Support

## Status

Accepted

## Context

When creating helper scripts for development, deployment, and maintenance tasks, we need to ensure they work consistently across different platforms (Windows, macOS, Linux). Common approaches include:

1. Shell scripts (`.sh`) - Platform-specific, requires different versions for Windows
2. Batch files (`.bat`) - Windows-specific
3. PowerShell scripts (`.ps1`) - Primarily Windows-focused
4. JavaScript files (`.js`) - Cross-platform, runs anywhere Node.js is installed

Additionally, we need to consider:

- Developer environment setup requirements
- Maintenance complexity
- Debugging capabilities
- Integration with our existing tooling
- Learning curve for contributors

## Decision

We will implement all helper scripts as JavaScript files (`.js`) instead of shell scripts or other platform-specific solutions.

Key aspects of this approach:

1. **Script Location**:

   ```
   ws_tooling/scripts/
   ├── setup/
   │   ├── init-env.js
   │   └── setup-dev.js
   ├── deploy/
   │   ├── deploy-prod.js
   │   └── verify-deploy.js
   └── maintenance/
       ├── clean-workspace.js
       └── validate-env.js
   ```

2. **Implementation Rules**:
   - Use vanilla JavaScript (no TypeScript) for immediate execution
   - Leverage Node.js built-in modules where possible
   - Include clear error handling and logging
   - Provide --help output for usage information
   - Support both interactive and CI/CD usage

3. **Script Standards**:

   ```javascript
   #!/usr/bin/env node
   
   // Always include help/usage information
   const showHelp = () => {
     console.log(`
       Usage: node script-name.js [options]
       
       Options:
         --help     Show this help
         --verbose  Enable verbose output
     `);
   };
   
   // Proper error handling
   try {
     // Script logic
   } catch (error) {
     console.error('Error:', error.message);
     process.exit(1);
   }
   ```

4. **Execution Method**:
   - Direct: `node scripts/setup/init-env.js`
   - Via pnpm script: `pnpm setup:env`

## Consequences

### Positive

- True cross-platform compatibility
- No need for platform-specific versions
- Easier debugging with Node.js tools
- Consistent with our JavaScript/Node.js stack
- Better IDE support for editing and validation
- Can use npm packages for complex tasks
- Easier to maintain and test
- Better error handling capabilities

### Negative

- Slightly more verbose than shell scripts for simple tasks
- Requires Node.js (already a prerequisite)
- Some system tasks may need extra modules
- May be slower than native shell scripts

### Neutral

- Different approach from traditional shell scripting
- Need to document Node.js module usage
- May need to educate contributors on Node.js scripting

## Implementation Notes

1. **Script Template**:

   ```javascript
   #!/usr/bin/env node
   
   const { execSync } = require('child_process');
   const path = require('path');
   const fs = require('fs');
   
   const args = process.argv.slice(2);
   const verbose = args.includes('--verbose');
   
   function log(...msgs) {
     if (verbose) console.log(...msgs);
   }
   
   function run(cmd) {
     try {
       execSync(cmd, { stdio: 'inherit' });
     } catch (error) {
       console.error(`Failed to run: ${cmd}`);
       throw error;
     }
   }
   
   // Script-specific logic here
   ```

2. **Common Utilities**:
   - Create shared utility functions
   - Standardize logging and error handling
   - Provide consistent CLI argument parsing

3. **Documentation**:
   - Include JSDoc comments
   - Provide examples in README
   - Document any required environment variables

4. **Testing**:
   - Add basic smoke tests
   - Verify cross-platform functionality
   - Test both success and failure cases

## Related

- [ADR-003: Build System Configuration with tsup](./003-build-system-configuration-with-tsup.md)
- [CI/CD Pipeline Improvements](../roadmap/infrastructure/ci-cd-improvements.md)
