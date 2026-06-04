#!/usr/bin/env bash
# Run pdf2md without installing as CLI package
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHONPATH="$SCRIPT_DIR" python3 -m pdf2md.cli "$@"
