#!/usr/bin/env bash

set -ex

for directory in */ ; do
    echo "Upgrading $directory"
    cd $directory
        if [ ! -f package.json ]; then
            echo "Skipping $directory"
            continue
        fi
        yarn
        yarn add unmock-node
    cd ..
done
