#!/usr/bin/env bash
# Build the five one-page A4 CV variants as PDFs in dist/typst/ using Typst.
#
# Pipeline:
#   1. node scripts/export-content.mjs  -> .build/cv-content.json
#   2. typst compile (once per variant) -> dist/typst/<key>.pdf
#   3. pdfinfo page-count check          -> per-variant ok/fail summary
#
# Requires: node, typst (e.g. ~/.local/bin/typst), pdfinfo (poppler-utils).
set -euo pipefail

# Resolve repo root (parent of this script's directory).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

# Make a user-local typst install discoverable without requiring a global one.
export PATH="$HOME/.local/bin:$PATH"

TYPST="${TYPST:-typst}"
VARIANTS=(
  eugene-lerman
  eugene-lerman-platform
  eugene-lerman-generalist
  eugene-lerman-ai-native
  eugene-lerman-ats
)

echo "Exporting content -> .build/cv-content.json"
node scripts/export-content.mjs

mkdir -p dist/typst

fail=0
declare -a summary=()
for key in "${VARIANTS[@]}"; do
  out="dist/typst/${key}.pdf"
  if "$TYPST" compile --root . --font-path fonts/ --input "variant=${key}" typst/cv.typ "$out" 2>/tmp/typst-err.$$; then
    pages="$(pdfinfo "$out" 2>/dev/null | awk '/^Pages:/ {print $2}')"
    if [ "$pages" = "1" ]; then
      summary+=("  \xE2\x9C\x93 ${key}  (1 page)")
    else
      summary+=("  \xE2\x9C\x97 ${key}  (${pages:-?} pages - must be 1)")
      fail=1
    fi
  else
    summary+=("  \xE2\x9C\x97 ${key}  (compile failed)")
    cat /tmp/typst-err.$$ >&2 || true
    fail=1
  fi
done
rm -f /tmp/typst-err.$$

echo
echo "Typst CV build summary:"
for line in "${summary[@]}"; do
  printf '%b\n' "$line"
done

exit "$fail"
