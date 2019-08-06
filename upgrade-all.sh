#!/usr/bin/env bash

set -ex

source ./loop-directories.sh

update_unmock () {
    yarn
    yarn add unmock-node
}

loop_directories update_unmock
