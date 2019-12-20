#!/usr/bin/env bash

set -ex

loop_directories () {
    cwd=$(pwd)
    echo "Current directory ${cwd}"
    for directory in */ ; do
        echo "Moving to $directory"
        cd $directory
            if [ ! -f package.json ]; then
                echo "Skipping $directory"
                cd $cwd
                continue
            fi

            # If has second argument, verify that string starts with $2
            regexp="$2"
            echo "Checking equality of $directory to $regexp"
            if [[ ! -z $2 ]] && [[ ! "$directory" =~ $regexp ]]; then
                echo "Skipping $directory because does not match: $regexp"
                cd $cwd
                continue
            fi

            $1
        cd $cwd
    done
}

run_tests () {
    run_test () {
        # To try and run in older versions of Node.js
        yarn --ignore-engines
        yarn upgrade unmock -D --ignore-engines
        yarn test
    }

    loop_directories run_test $1
}

upgrade_unmocks () {
    upgrade () {
        yarn
        yarn add unmock -D
    }
    loop_directories upgrade $1
}

link_unmocks () {
    link () {
        yarn link unmock unmock-core unmock-node openapi-refinements unmock-browser unmock-fetch
    }
    loop_directories link $1
}

unlink_unmocks () {
    unlink () {
        yarn unlink unmock unmock-core unmock-node openapi-refinements unmock-browser unmock-fetch
        yarn install --force
    }
    loop_directories unlink $1
}

if [ "$#" -gt 2 ]; then
    echo "Max two arguments expected"
    exit 1
fi

if [ "$1" == "test" ]; then
    run_tests $2
elif [ "$1" == "upgrade" ]; then
    upgrade_unmocks $2
elif [ "$1" == "link" ]; then
    link_unmocks $2
elif [ "$1" == "unlink" ]; then
    unlink_unmocks $2
else
    echo "Unknown argument $1"
    exit 1
fi
