# Changelog

All notable changes to this project will be documented in this file.

## [2.6.0] - 2026-02-22

### Added
- Integrated QR code and pairing code server in main bot
- Render deployment configuration with `render.yaml` and `render.json`
- Comprehensive deployment guide (`DEPLOYMENT.md`)
- Updated security guidelines (`SECURITY.md`)
- Enhanced contribution guidelines (`CONTRIBUTING.md`)
- `.env.example` for easy configuration setup
- Improved web interface for session generation
- Better error handling in QR and pairing code generation

### Changed
- Updated `package.json` with cleaner dependencies
- Improved `config.js` for better environment variable handling
- Updated `index.js` to run bot and server concurrently
- Enhanced `qr-server/qr.js` with better error handling
- Improved `qr-server/pair.js` with better session management
- Updated `qr-server/main.html` with modern UI
- Changed deployment type from `worker` to `web` in `render.yaml`

### Fixed
- Session ID generation issues
- QR code timeout problems
- Pairing code reliability
- Dependency vulnerabilities (reduced from 34 to minimal)
- Bot startup errors when SESSION_ID is not set

### Security
- Removed hardcoded session IDs from config
- Added `.gitignore` to prevent sensitive file leaks
- Updated security policy for Node.js versions
- Added environment variable best practices

### Deprecated
- Old Heroku deployment method (still supported but Render recommended)
- Separate QR server deployment (now integrated)

## [2.5.0] - Previous Release

### Features
- Multi-device WhatsApp support
- AI enhancement features
- Media downloaders (YouTube, Facebook, Instagram)
- Games and entertainment plugins
- Economy system
- Logo maker
- QR code generation (separate server)

---

## Version Format

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## How to Update

To update to the latest version:

```bash
git pull origin main
npm install
npm start
```

## Support

For issues or questions about specific versions:
- **GitHub Issues**: [Report here](https://github.com/King-pe/PETER-md/issues)
- **WhatsApp**: [Contact Peter](https://wa.me/255715654328)
- **Email**: ptechtanzania015@gmail.com

---

*Made with ❤️ by Peter-MD Tech*
