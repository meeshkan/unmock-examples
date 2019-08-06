#!/usr/bin/env bash

set -ex

source ./loop-directories.sh

run_tests () {
    yarn test
}

loop_directories run_tests
