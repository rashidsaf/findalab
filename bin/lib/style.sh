#!/usr/bin/env bash

export RED='\033[0;31m'
export GREEN='\033[0;32m'
export BLUE='\033[0;34m'
export NC='\033[0m'
export NC_BOLD=${NC}'\033[1m'

#######################################
# Prints a style formatted string.
#
# Arguments:
#  1 the string to print.
#######################################
print() {
  printf "${1}${NC}"
}

#######################################
# Prints a style formatted line.
#
# Arguments:
#  1 the string to print.
#######################################
println() {
  print "${1}\n"
}
