#!/bin/bash
set -e

# Read hook input from stdin
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Check if target file is a .env file
if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

BASENAME=$(basename "$FILE_PATH")

if [[ "$BASENAME" == .env* ]]; then
  echo "Blocked: Editing .env files is not allowed. These files contain secrets and should be managed manually." >&2
  exit 2
fi

exit 0
