#!/bin/bash

# Default values
EVENT="push"
WORKFLOW=""
LIST_ONLY=false
VERBOSE=false

# Help function
help() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  --workflow <file>  Specify workflow file to run (required unless --list is used)"
  echo "  --event <event>    Specify event type (default: push)"
  echo "  --list            List available workflows"
  echo "  --verbose         Enable verbose output"
  echo "  --help            Display this help message"
}

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --event) EVENT="$2"; shift ;;
    --workflow) WORKFLOW="$2"; shift ;;
    --list) LIST_ONLY=true ;;
    --verbose) VERBOSE=true ;;
    --help) help; exit 0 ;;
    *) echo "Unknown parameter: $1"; help; exit 1 ;;
  esac
  shift
done

# Check if act is installed
if ! command -v act &> /dev/null; then
  echo "Error: 'act' is not installed"
  echo "To install on macOS: brew install act"
  echo "For other platforms, visit: https://github.com/nektos/act#installation"
  exit 1
fi

# Build act command
ACT_CMD="act"
if [ "$VERBOSE" = true ]; then
  ACT_CMD="$ACT_CMD -v"
fi

# Check if running on M-series Mac
if [[ "$(uname -m)" == "arm64" ]]; then
  ACT_CMD="$ACT_CMD --container-architecture linux/amd64"
fi

# Use medium-sized runner image
ACT_CMD="$ACT_CMD -P ubuntu-latest=catthehacker/ubuntu:act-latest"

# Add common environment variables
ACT_CMD="$ACT_CMD -e CI=true -e GITHUB_WORKSPACE=/workspace -e ACT=true"

# List workflows or run specified workflow
if [ "$LIST_ONLY" = true ]; then
  $ACT_CMD -l
else
  if [ -z "$WORKFLOW" ]; then
    echo "Error: --workflow is required unless --list is used"
    help
    exit 1
  fi
  echo "Running GitHub Actions locally with event: $EVENT"
  echo "Command: $ACT_CMD -W .github/workflows/$WORKFLOW -e .github/workflows/event.json $EVENT"
  $ACT_CMD -W ".github/workflows/$WORKFLOW" -e ".github/workflows/event.json" "$EVENT"
fi 