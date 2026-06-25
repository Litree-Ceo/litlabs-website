#!/bin/bash
# Fix WSL PATH for touchdesigner-cli
LINE='export PATH="/home/litbit/.local/bin:$PATH"'
if ! grep -q "/home/litbit/.local/bin" ~/.bashrc; then
    echo "$LINE" >> ~/.bashrc
    echo "PATH updated in ~/.bashrc"
else
    echo "PATH already set"
fi
source ~/.bashrc
which td-cli && echo "td-cli is ready"
