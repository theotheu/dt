#!/bin/bash
clear

### Check for errors; abandon the process if error exist
function checkError {
    if [[ $1 -ne 0 ]] ; then
        exit 99
    fi
}

echo "*** LintRoller on /app/... ***"
node Lint-Runner.js
checkError $?

### Exit successfully
exit 0
