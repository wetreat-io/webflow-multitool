#!/bin/bash

# Create ssl directory if it doesn't exist
mkdir -p ssl

# Generate private key
openssl genrsa -out ssl/dev.key 2048

# Generate CSR (Certificate Signing Request)
openssl req -new -key ssl/dev.key -out ssl/dev.csr -subj "/CN=localhost"

# Generate self-signed certificate
openssl x509 -req -days 365 -in ssl/dev.csr -signkey ssl/dev.key -out ssl/dev.crt

# Set proper permissions
chmod 600 ssl/dev.key
chmod 644 ssl/dev.crt

echo "Development certificates generated successfully!"
echo "Files created:"
echo "- ssl/dev.key (private key)"
echo "- ssl/dev.crt (certificate)"
echo "- ssl/dev.csr (certificate signing request)" 