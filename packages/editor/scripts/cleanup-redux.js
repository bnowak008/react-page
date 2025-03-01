#!/usr/bin/env node

/**
 * This script helps with cleaning up Redux dependencies and unused code
 * after the migration to Zustand is complete.
 * 
 * Usage: node cleanup-redux.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');
const REDUX_DIRS = [
  path.join(ROOT_DIR, 'src/core/actions'),
  path.join(ROOT_DIR, 'src/core/reducer'),
  path.join(ROOT_DIR, 'src/core/selector'),
  path.join(ROOT_DIR, 'src/core/middleware'),
];
const REDUX_FILES = [
  path.join(ROOT_DIR, 'src/core/reduxConnect.tsx'),
  path.join(ROOT_DIR, 'src/core/Provider.tsx'),
  path.join(ROOT_DIR, 'src/core/store.ts'),
];
const REDUX_DEPENDENCIES = [
  'redux',
  'react-redux',
  'redux-thunk',
  'redux-undo',
  '@types/redux',
  '@types/react-redux',
  '@types/redux-thunk',
];

// Helper functions
function removeDirectories(directories) {
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`Removing directory: ${dir}`);
      fs.rmSync(dir, { recursive: true, force: true });
    } else {
      console.log(`Directory does not exist: ${dir}`);
    }
  });
}

function removeFiles(files) {
  files.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`Removing file: ${file}`);
      fs.unlinkSync(file);
    } else {
      console.log(`File does not exist: ${file}`);
    }
  });
}

function removeDependencies(dependencies) {
  if (!fs.existsSync(PACKAGE_JSON_PATH)) {
    console.error(`Package.json not found at: ${PACKAGE_JSON_PATH}`);
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  let modified = false;

  // Check dependencies
  if (packageJson.dependencies) {
    dependencies.forEach(dep => {
      if (packageJson.dependencies[dep]) {
        console.log(`Removing dependency: ${dep}`);
        delete packageJson.dependencies[dep];
        modified = true;
      }
    });
  }

  // Check devDependencies
  if (packageJson.devDependencies) {
    dependencies.forEach(dep => {
      if (packageJson.devDependencies[dep]) {
        console.log(`Removing devDependency: ${dep}`);
        delete packageJson.devDependencies[dep];
        modified = true;
      }
    });
  }

  // Check peerDependencies
  if (packageJson.peerDependencies) {
    dependencies.forEach(dep => {
      if (packageJson.peerDependencies[dep]) {
        console.log(`Removing peerDependency: ${dep}`);
        delete packageJson.peerDependencies[dep];
        modified = true;
      }
    });
  }

  if (modified) {
    console.log('Updating package.json');
    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2));
  } else {
    console.log('No dependencies to remove from package.json');
  }
}

function analyzeBundleSize() {
  console.log('Analyzing bundle size before cleanup...');
  try {
    execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
    const beforeSize = getDirectorySize(path.join(ROOT_DIR, 'lib'));
    console.log(`Bundle size before cleanup: ${(beforeSize / 1024 / 1024).toFixed(2)}MB`);
    
    return beforeSize;
  } catch (error) {
    console.error('Error analyzing bundle size:', error.message);
    return 0;
  }
}

function getDirectorySize(directory) {
  let size = 0;
  
  if (!fs.existsSync(directory)) {
    return 0;
  }
  
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

// Main function
async function main() {
  console.log('Starting Redux cleanup...');
  
  // Analyze bundle size before cleanup
  const beforeSize = analyzeBundleSize();
  
  // Remove Redux directories
  console.log('\nRemoving Redux directories...');
  removeDirectories(REDUX_DIRS);
  
  // Remove Redux files
  console.log('\nRemoving Redux files...');
  removeFiles(REDUX_FILES);
  
  // Remove Redux dependencies
  console.log('\nRemoving Redux dependencies from package.json...');
  removeDependencies(REDUX_DEPENDENCIES);
  
  // Install dependencies
  console.log('\nUpdating dependencies...');
  try {
    execSync('npm install', { cwd: ROOT_DIR, stdio: 'inherit' });
  } catch (error) {
    console.error('Error updating dependencies:', error.message);
  }
  
  // Analyze bundle size after cleanup
  console.log('\nAnalyzing bundle size after cleanup...');
  try {
    execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
    const afterSize = getDirectorySize(path.join(ROOT_DIR, 'lib'));
    console.log(`Bundle size after cleanup: ${(afterSize / 1024 / 1024).toFixed(2)}MB`);
    
    const reduction = beforeSize - afterSize;
    const reductionPercentage = (reduction / beforeSize) * 100;
    
    console.log(`Bundle size reduction: ${(reduction / 1024 / 1024).toFixed(2)}MB (${reductionPercentage.toFixed(2)}%)`);
  } catch (error) {
    console.error('Error analyzing bundle size:', error.message);
  }
  
  console.log('\nRedux cleanup completed!');
}

main().catch(error => {
  console.error('Error during cleanup:', error);
  process.exit(1);
}); 