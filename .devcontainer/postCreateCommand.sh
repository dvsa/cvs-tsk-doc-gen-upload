#!/bin/bash

# Set up git secrets
git clone -q --no-tags --single-branch git@github.com:awslabs/git-secrets.git ~/.git-secrets
sudo make -C ~/.git-secrets install

# cpio is required for package/release builds (npm run package)
sudo apt -y update && sudo apt install -y cpio

# Some useful aliases
# Container image includes VIM aliased as vi
echo "alias ll='ls -alF'" >> ~/.bash_aliases
echo "alias vim='vi'" >> ~/.bash_aliases
