#!/bin/bash

# Inspired by the norio-nomura/action-swiftlint action.
# https://github.com/norio-nomura/action-swiftlint

function stripPWD() {
  if ! ${WORKING_DIRECTORY+false}; then
    cd - > /dev/null
  fi
  sed -E "s/$(pwd|sed 's/\//\\\//g')\///"
}

if ! ${WORKING_DIRECTORY+false}; then
  cd ${WORKING_DIRECTORY}
fi

if ! ${DIFF_BASE+false}; then
  changedFiles=$(git --no-pager diff --name-only --relative FETCH_HEAD $(git merge-base FETCH_HEAD $DIFF_BASE) -- '*.swift')
  if [ -z "$changedFiles" ] then
    echo "No Swift file changed"
    exit
  fi
fi

set -o pipefail && swiftlint "$@" --reporter github-actions-logging -- $changedFiles | stripPWD
