#!/usr/bin/env bash

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

. "${ROOT}"/bin/lib/env.sh
. "${ROOT}"/bin/lib/style.sh
. "${ROOT}"/bin/lib/exitCheck.sh

DIR="${ROOT}/${1}"

println "${GREEN}Checking ${DIR}/.env file..."
if [ ! -e "${DIR}"/.env ]; then
  println "${NC_BOLD}No ${1} .env file found. Creating from ${DIR}/.env.example..."
  cp "${DIR}"/.env.example "${DIR}"/.env
  exitCheck $?
  println "${NC_BOLD}NOTE: Please review the .env file and configure any required parameters."
else
  DIFF=$(diff "${DIR}"/.env "${DIR}"/.env.example)
  if [ -z "${DIFF}" ]; then
    println "${NC_BOLD}.env file exists, and matches example. Skipping create."
  else
    println "${RED}.env file exists, but does NOT match example. Skipping create."
    println "${RED}NOTE: Please note the following differences, and update your .env if necessary:"
    println "${DIFF}"
  fi
fi
