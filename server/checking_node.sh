#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if command_exists node; then
    echo "Node.js is already installed. Version: $(node -v)"
    echo "and, npm Version: $(npm -v)"
else
    echo "Node.js is not installed."
fi
