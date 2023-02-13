#!/bin/bash

# Container image includes VIM aliased as vi
git config --global core.editor vi

# Set up git secrets
git clone -q --no-tags --single-branch git@github.com:awslabs/git-secrets.git ~/.git-secrets
sudo make -C ~/.git-secrets install

# cpio is required for package/release builds (npm run package)
sudo apt -y update && sudo apt install -y cpio
