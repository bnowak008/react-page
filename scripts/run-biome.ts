#!/usr/bin/env bun

import { spawnSync } from 'child_process';
import { resolve } from 'path';
import { readdirSync } from 'fs';

const PACKAGES_DIR = resolve(process.cwd(), 'packages');

// Get all package directories
const packages = readdirSync(PACKAGES_DIR, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

// Get command line arguments
const args = process.argv.slice(2);
const isFormat = args.includes('--format');
const isFix = args.includes('--fix');

// Build the Biome command
const command = isFormat ? 'format' : 'check';
const fixFlag = isFix ? (isFormat ? '--write' : '--apply') : '';

// Process each package
for (const pkg of packages) {
  const srcDir = resolve(PACKAGES_DIR, pkg, 'src');

  console.log(`\nProcessing ${pkg}...`);

  const result = spawnSync(
    'biome',
    [command, fixFlag, `${srcDir}/**/*.{ts,tsx}`].filter(Boolean),
    {
      stdio: 'inherit',
      shell: true,
    }
  );

  if (result.status !== 0) {
    console.error(`Failed to process ${pkg}`);
  }
}
