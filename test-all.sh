#!/usr/bin/env bash

set -ex

for directory in */ ; do

    echo "Verifying $directory"
    cd $directory
        if [ ! -f package.json ]; then
            echo "Skipping $directory"
            continue
        fi
        yarn test
    cd ..
done
