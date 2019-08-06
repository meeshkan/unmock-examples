#!/usr/bin/env bash

set -ex

for directory in */ ; do
    echo "Upgrading $directory"
    cd $directory
        yarn
        yarn add unmock-node
    cd ..
done
