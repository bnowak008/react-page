#!/usr/bin/env bun
import { unlinkSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { spawnSync } from 'child_process';

const ROOT_DIR = process.cwd();
const DRY_RUN = process.argv.includes('--dry-run');

if (DRY_RUN) {
  console.log('Running in dry-run mode - no files will be modified\n');
}

// Files to be removed
const LEGACY_FILES = [
  'lerna.json',
  '.yarnrc',
  '.yarnrc.yml',
  'yarn.lock',
  '.npmrc',
  'package-lock.json',
  '.nvmrc',
];

// Directories to be cleaned
const LEGACY_DIRS = [
  '.yarn',
  'node_modules/.cache/yarn',
  'node_modules/.cache/lerna',
];

// Update .gitignore
const GITIGNORE_ADDITIONS = [
  '# Bun',
  'bun.lockb',
  'node_modules',
  '.env',
  '*.log',
  'dist',
  'lib',
  'coverage',
  '.DS_Store',
];

function cleanupLegacyFiles() {
  console.log('Cleaning up legacy files...');

  LEGACY_FILES.forEach((file) => {
    const filePath = resolve(ROOT_DIR, file);
    if (existsSync(filePath)) {
      try {
        if (!DRY_RUN) {
          unlinkSync(filePath);
        }
        console.log(
          `${DRY_RUN ? '[DRY-RUN] Would remove' : '✓ Removed'} ${file}`
        );
      } catch (error) {
        console.error(`✗ Failed to remove ${file}:`, error);
      }
    }
  });
}

function cleanupLegacyDirs() {
  console.log('\nCleaning up legacy directories...');

  LEGACY_DIRS.forEach((dir) => {
    const dirPath = resolve(ROOT_DIR, dir);
    if (existsSync(dirPath)) {
      try {
        if (!DRY_RUN) {
          spawnSync('rm', ['-rf', dirPath]);
        }
        console.log(
          `${DRY_RUN ? '[DRY-RUN] Would remove' : '✓ Removed'} ${dir}`
        );
      } catch (error) {
        console.error(`✗ Failed to remove ${dir}:`, error);
      }
    }
  });
}

function updateGitignore() {
  console.log('\nUpdating .gitignore...');

  const gitignorePath = resolve(ROOT_DIR, '.gitignore');
  const currentContent = existsSync(gitignorePath)
    ? readFileSync(gitignorePath, 'utf-8')
    : '';

  const newContent = [
    ...new Set([...currentContent.split('\n'), '', ...GITIGNORE_ADDITIONS]),
  ].join('\n');

  if (!DRY_RUN) {
    try {
      writeFileSync(gitignorePath, newContent);
      console.log('✓ Updated .gitignore');
    } catch (error) {
      console.error('✗ Failed to update .gitignore:', error);
    }
  } else {
    console.log('[DRY-RUN] Would update .gitignore with:');
    console.log(GITIGNORE_ADDITIONS.join('\n'));
  }
}

function removeDeprecatedScripts() {
  console.log('\nRemoving deprecated scripts...');

  const pkgJsonPath = resolve(ROOT_DIR, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));

  // List of scripts to remove
  const deprecatedScripts = ['lerna', 'bootstrap', 'yarn', 'postinstall'];

  // Remove deprecated scripts
  let modified = false;
  deprecatedScripts.forEach((script) => {
    if (pkg.scripts?.[script]) {
      if (!DRY_RUN) {
        delete pkg.scripts[script];
      }
      console.log(
        `${
          DRY_RUN ? '[DRY-RUN] Would remove script' : '✓ Removed script'
        }: ${script}`
      );
      modified = true;
    }
  });

  if (modified && !DRY_RUN) {
    try {
      writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + '\n');
      console.log('✓ Updated package.json');
    } catch (error) {
      console.error('✗ Failed to update package.json:', error);
    }
  }
}

async function main() {
  console.log('Starting cleanup process...\n');

  cleanupLegacyFiles();
  cleanupLegacyDirs();
  updateGitignore();
  removeDeprecatedScripts();

  console.log(`\nCleanup ${DRY_RUN ? 'dry-run' : ''} complete!`);
}

main().catch(console.error);
