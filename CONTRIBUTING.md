# Contributing to PETER-MD

Thank you for your interest in contributing to PETER-MD! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Report security issues privately
- Follow the existing code style
- Test your changes before submitting

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/PETER-md.git
   cd PETER-md
   ```

3. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

1. **Make your changes** in the appropriate files
2. **Test your changes** locally
3. **Commit with clear messages**:
   ```bash
   git commit -m "Add: description of your changes"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub

## Commit Message Guidelines

Use clear, descriptive commit messages:

- `Add:` for new features
- `Fix:` for bug fixes
- `Improve:` for improvements
- `Update:` for updates
- `Remove:` for removals
- `Docs:` for documentation changes

Example:
```
Add: QR code generation for session creation
Fix: Session timeout issue
Improve: Error handling in bot connection
```

## Pull Request Process

1. Update the README.md with any new features
2. Update CHANGELOG.md if applicable
3. Ensure your code follows the existing style
4. Request review from maintainers
5. Address any feedback

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Node.js and npm versions
- Any error messages

### Feature Requests

Include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Any relevant examples

## Project Structure

```
PETER-MD/
├── lib/              # Core bot logic
├── plugins/          # Bot plugins and commands
├── qr-server/        # QR code and pairing server
├── config.js         # Configuration
├── index.js          # Entry point
├── package.json      # Dependencies
└── README.md         # Documentation
```

## Coding Standards

- Use consistent indentation (2 spaces)
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code patterns
- Test your code before submitting

## Testing

Before submitting a PR:

1. Test locally with `npm start`
2. Check for console errors
3. Test with different configurations
4. Verify no breaking changes

## Documentation

- Update README.md for new features
- Add comments to complex code
- Update DEPLOYMENT.md for deployment changes
- Keep SECURITY.md updated

## How To Contribute

1. Create an Issue on GitHub describing your contribution
2. Fork the repository
3. Make your changes
4. Submit a Pull Request
5. We'll review and merge if it's good!

## Contact

- **WhatsApp**: [Peter Joram](https://wa.me/255715654328)
- **Email**: ptechtanzania015@gmail.com
- **GitHub Issues**: [Ask here](https://github.com/King-pe/PETER-md/issues)

## License

By contributing, you agree that your contributions will be licensed under the Apache-2.0 License.

---

*Thank you for contributing to PETER-MD!*
