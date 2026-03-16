#!/bin/bash
set -e

# Read hook input from stdin
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only lint TypeScript/TSX files
if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

if [[ "$FILE_PATH" != *.ts && "$FILE_PATH" != *.tsx ]]; then
  exit 0
fi

# Check if file exists
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Run ESLint --fix on the file
cd "$CLAUDE_PROJECT_DIR"
npx eslint --fix "$FILE_PATH" 2>&1 || true

exit 0
