# Security Policy

## Node.js Version Support

Please use Node.js 18.x or higher for best performance and security.

| Version | Status |
|---------|--------|
| 14.x | ❌ Not Supported |
| 16.x | ⚠️ Limited Support |
| 18.x | ✅ Recommended |
| 20.x | ✅ Recommended |

## Reporting Security Issues

If you discover a security vulnerability in PETER-MD, please email us at **ptechtanzania015@gmail.com** instead of using the public issue tracker.

## Security Best Practices

### 1. Session ID Protection

Your `SESSION_ID` is sensitive and grants full access to your WhatsApp account. **Never share it publicly.**

- ❌ Do NOT commit `SESSION_ID` to GitHub
- ❌ Do NOT share it in public forums or groups
- ❌ Do NOT paste it in screenshots or videos
- ✅ Store it only in environment variables
- ✅ Use `.env` file locally (add to `.gitignore`)
- ✅ Use Render's environment variables for deployment

### 2. Environment Variables

Always use environment variables for sensitive data:

```bash
# Good
SESSION_ID=your_session_here
MONGODB_URI=your_mongo_uri_here

# Bad (in code)
const sessionId = "your_session_here";
```

### 3. Database Security

- Use strong passwords for MongoDB
- Enable IP whitelisting in MongoDB Atlas
- Regularly backup your database
- Limit database user permissions

### 4. Deployment Security

- Always use HTTPS for your Render deployment
- Keep dependencies updated regularly
- Monitor logs for suspicious activity
- Use strong passwords for all accounts

### 5. Code Security

- Review code before running it
- Don't use untrusted plugins
- Keep Node.js and npm updated
- Run `npm audit` regularly

## Dependency Vulnerabilities

We actively monitor and update dependencies. To check for vulnerabilities:

```bash
npm audit
```

To fix vulnerabilities:

```bash
npm audit fix
```

## Supported Versions

| Version | Status |
|---------|--------|
| 2.6.0+ | ✅ Supported |
| 2.5.x | ⚠️ Limited Support |
| < 2.5.0 | ❌ Unsupported |

## Security Updates

We recommend:
- Updating to the latest version regularly
- Enabling automatic dependency updates
- Subscribing to security notifications

## Contact

- **Email**: ptechtanzania015@gmail.com
- **WhatsApp**: [Peter Joram](https://wa.me/255715654328)

---

*Powered by PETER-MD Tech*
