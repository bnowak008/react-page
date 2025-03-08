# Security Policy

## Supported Versions

We currently support the following versions with security updates:

| Version | Supported          |
| ------- | ----------------- |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Dependency Management

### Version Pinning
- All dependencies must be pinned to exact versions (no ^ or ~ version ranges)
- Exceptions must be explicitly documented and approved

### Security Scanning
- Regular security audits using `bun pm audit`
- Automated vulnerability scanning in CI/CD pipeline
- Manual review of dependency updates

### Update Process
1. Run `bun pm outdated` to check for updates
2. Review changelog and breaking changes
3. Run `bun pm upgrade` to update dependencies
4. Run security scan with `bun run security`
5. Run test suite and verify functionality
6. Commit updates with detailed changelog

## Lockfile Security

### Integrity
- Lockfile must be committed to version control
- Verify lockfile integrity with `bun install --dry-run`
- Use Bun's built-in checksum verification

### Resolution
- Use resolutions field for enforcing minimum versions
- Document all resolution overrides
- Regular audit of resolution entries

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do Not** open a public issue
2. Email security@react-page.org with details
3. Allow 48 hours for initial response
4. Work with maintainers on fix and disclosure

## Development Guidelines

### Code Security
- Use strict TypeScript settings
- Enable all relevant ESLint security rules
- Regular security-focused code reviews

### Build Process
- Use Bun's built-in bundler for controlled builds
- Verify package contents before publishing
- Sign all release tags

### Runtime Security
- Validate all inputs
- Sanitize content appropriately
- Use Content Security Policy headers
- Follow secure coding practices

## Compliance

### Audit Logs
- Security scan results stored in `security-audit.log`
- Regular review of audit findings
- Track resolution of security issues

### Updates
This security policy is reviewed and updated regularly. Last update: 2024-03-07 