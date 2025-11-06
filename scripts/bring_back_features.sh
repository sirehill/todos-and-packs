#!/usr/bin/env bash
# Packs & Lists — bring back features / migrate schema (Unix/Mac)
set -euo pipefail

echo "Installing dependencies..."
npm install

echo "Formatting Prisma schema..."
npx prisma format

echo "Creating / applying migration..."
npx prisma migrate dev -n bring_back_features

echo "Done."
