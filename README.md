Create a new webflow app
https://developers.webflow.com/designer/reference/introduction

Install this to your webflow site

Plugin your ChatGPT key

## Development Setup

### SSL Certificates

For local development, you'll need SSL certificates. We provide a script to generate self-signed certificates:

```bash
# Generate development certificates
./scripts/generate-dev-cert.sh
```

This will create the following files in the `ssl` directory:
- `dev.key`: Private key
- `dev.crt`: Self-signed certificate
- `dev.csr`: Certificate signing request

Note: These certificates are for development only. Never use them in production.

### Production SSL

For production environments:
1. Use a proper SSL certificate from a trusted Certificate Authority (CA)
2. Store certificates securely using your hosting provider's certificate management system
3. Never commit SSL certificates or private keys to the repository

