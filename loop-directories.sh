loop_directories () {
    for directory in */ ; do
        echo "Upgrading $directory"
        cd $directory
            if [ ! -f package.json ]; then
                echo "Skipping $directory"
                continue
            fi
            $1
        cd ..
    done
}