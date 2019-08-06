#!/usr/bin/env bash

set -ex

loop_directories () {
    for directory in */ ; do
        echo "Moving to $directory"
        cd $directory
            if [ ! -f package.json ]; then
                echo "Skipping $directory"
                continue
            fi
            $1
        cd ..
    done
}

run_tests () {
    run_test () {
        yarn
        yarn upgrade unmock-node -D
        yarn test
    }

    loop_directories run_test
}

upgrade_unmocks () {
    upgrade () {
        yarn
        yarn add unmock-node -D
    }
    loop_directories upgrade
}

if [ "$#" -ne 1 ]; then
    echo "One argument expected"
    exit 1
fi

if [ "$1" == "test" ]; then
    run_tests
elif [ "$1" == "upgrade" ]; then
    upgrade_unmocks
else
    echo "Unknown argument $1"
    exit 1
fi
