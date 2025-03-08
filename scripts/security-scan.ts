#!/usr/bin/env bun
import { spawnSync } from "child_process";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";

const SECURITY_LOG = resolve(process.cwd(), "security-audit.log");

// Run Bun's security audit
function runBunAudit(): string {
  console.log("Running Bun security audit...");
  const result = spawnSync("bun", ["pm", "audit"], { encoding: "utf8" });
  return result.stdout;
}

// Check for known vulnerabilities in dependencies
function checkDependencies(): [string, string][] {
  console.log("Checking dependencies...");
  const pkgJson = JSON.parse(
    readFileSync(resolve(process.cwd(), "package.json"), "utf8")
  );
  
  const allDeps: Record<string, string> = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
  };

  // Check for pinned versions (avoiding ^ and ~)
  const unpinnedDeps = Object.entries(allDeps).filter(([, version]) =>
    String(version).startsWith("^") || String(version).startsWith("~")
  );

  return unpinnedDeps;
}

// Verify lockfile integrity
function verifyLockfile(): string {
  console.log("Verifying lockfile integrity...");
  const result = spawnSync("bun", ["install", "--dry-run"], { encoding: "utf8" });
  return result.stdout;
}

// Main security scan
async function main() {
  const timestamp = new Date().toISOString();
  const results: string[] = [];

  // Run security audit
  results.push("=== Bun Security Audit ===");
  results.push(runBunAudit());

  // Check dependencies
  results.push("\n=== Dependency Check ===");
  const unpinnedDeps = checkDependencies();
  if (unpinnedDeps.length > 0) {
    results.push("Warning: Found unpinned dependencies:");
    unpinnedDeps.forEach(([dep, version]) => {
      results.push(`  ${dep}: ${version}`);
    });
  } else {
    results.push("All dependencies are properly pinned.");
  }

  // Verify lockfile
  results.push("\n=== Lockfile Verification ===");
  results.push(verifyLockfile());

  // Write results to log file
  const log = `Security Scan Results (${timestamp})\n\n${results.join("\n")}`;
  writeFileSync(SECURITY_LOG, log);
  console.log(`Security scan complete. Results written to ${SECURITY_LOG}`);
}

main().catch(console.error); 