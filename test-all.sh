#!/usr/bin/env bash

set -ex

for directory in */ ; do
    echo "Verifying $directory"
    cd $directory
        yarn test
    cd ..
done
