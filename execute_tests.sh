#!/bin/bash
# Install dependencies first
npm install --save-dev cypress@13.6.0 @testing-library/cypress@10.0.1 typescript@5.3.3

# Make scripts executable and run tests
chmod +x delete.sh
./delete.sh
