# CI/CD Tooling

This directory contains tools and scripts for running and testing CI/CD workflows locally.

## Prerequisites

- [act](https://github.com/nektos/act) - Run GitHub Actions locally
  ```bash
  # Install with Homebrew (macOS)
  brew install act

  # Other installation methods
  # See: https://github.com/nektos/act#installation
  ```

## Scripts

### run-actions.sh

Run GitHub Actions workflows locally using `act`.

```bash
# Basic usage (runs all workflows with push event)
./ws_tooling/cicd/scripts/run-actions.sh

# Run a specific workflow
./ws_tooling/cicd/scripts/run-actions.sh --workflow ci.yml

# List available workflows
./ws_tooling/cicd/scripts/run-actions.sh --list

# Run with verbose output
./ws_tooling/cicd/scripts/run-actions.sh --verbose

# Run with a different trigger event
./ws_tooling/cicd/scripts/run-actions.sh --event pull_request
```

#### Options

- `-w, --workflow FILE` - Specific workflow file to run (e.g., `ci.yml`)
- `-e, --event EVENT` - Event to trigger (default: `push`)
- `-l, --list` - List workflows instead of running them
- `-v, --verbose` - Enable verbose output
- `-h, --help` - Show help message

## Environment Setup

The script automatically:
- Handles architecture differences (e.g., M-series Macs)
- Uses the medium-sized Ubuntu runner image
- Sets common environment variables:
  - `CI=true`
  - `GITHUB_WORKSPACE=/workspace`
  - `ACT=true`

## Common Issues

1. **Docker Permission Issues**
   - Ensure Docker is running
   - Ensure your user has permissions to run Docker commands

2. **Architecture Compatibility**
   - On M-series Macs (arm64), the script automatically uses `linux/amd64` architecture
   - This ensures compatibility with GitHub Actions runners

3. **Missing act**
   - The script will check if `act` is installed
   - If missing, it will provide installation instructions

## Examples

```bash
# Run the CI workflow
./ws_tooling/cicd/scripts/run-actions.sh --workflow ci.yml

# Run the deployment workflow with pull_request event
./ws_tooling/cicd/scripts/run-actions.sh --workflow deployment.yml --event pull_request

# List all workflows with verbose output
./ws_tooling/cicd/scripts/run-actions.sh --list --verbose
```

### Configuration

- `.actrc`: Default configuration for act
- `docker/act.Dockerfile`: Custom runner image that matches our GitHub Actions environment

### Environment Variables

Create a `.env` file in the root directory with any secrets needed by your workflows:

```env
GITHUB_TOKEN=your_token_here
TURBO_TOKEN=your_turbo_token
```

### Debugging

1. Use the `--verbose` flag for detailed output
2. Check Docker logs if the container fails to start
3. Inspect the workspace inside the container using `docker exec` 