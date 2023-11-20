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

set -o pipefail && swiftlint "$@" --reporter github-actions-logging | stripPWD
