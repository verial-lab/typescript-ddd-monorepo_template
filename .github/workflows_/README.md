# Disabled GitHub Workflows

This directory contains GitHub Actions workflows that are currently disabled. These workflows provide additional functionality for:

- Automated deployments
- Release management
- Docker image builds and publishing

## How to Enable

To enable any of these workflows:

1. Move the desired `.yml` file from this directory (`.github/workflows_/`) to the active workflows directory (`.github/workflows/`)
2. Configure any required secrets or variables in your GitHub repository settings
3. Ensure all prerequisites are met (as documented in each workflow file)

## Available Workflows

- `deploy.yml` - Handles automated deployments to various environments
- `release.yml` - Manages versioning and release creation
- `docker.yml` - Builds and publishes Docker images

## Prerequisites

Before enabling these workflows, ensure you have:

1. Required secrets configured in your GitHub repository
2. Necessary permissions and access tokens
3. Infrastructure and deployment targets properly configured
4. Understanding of the workflow's impact on your development process

## Security Note

Always review and understand the workflows before enabling them, as they may require access to sensitive resources or deployment environments.
