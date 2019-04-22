#!/usr/bin/env bash

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../.." && pwd )"

. "${ROOT}"/bin/lib/exitCheck.sh
. "${ROOT}"/bin/lib/style.sh

EXPECTED_VERSION=1.8.4

# Check for existing installation
if [ -e "${ROOT}"/bin/composer ]; then
    println "${NC_BOLD}Checking Composer version..."
    FOUND_VERSION=`( \
        cd "${ROOT}" && \
        ./bin/composer --version | \
        tail -1 | \
        awk '{print $3}' | \
        "${ROOT}"/bin/linux-sed -r "s/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[mGK]//g" \
    )`

    # Check version of installed composer
    if [ "${FOUND_VERSION}" == "${EXPECTED_VERSION}" ]; then
        # Version is as expected. We're done.
        println "${NC_BOLD}Composer ${EXPECTED_VERSION} already installed."
        exit 0
    else
        # Version does not match. Remove it.
        println "${NC_BOLD}Removing Composer version ${FOUND_VERSION}..."
        rm "${ROOT}"/bin/composer
        exitCheck $?
    fi
fi

# Install composer
println "${NC_BOLD}Installing Composer ${GREEN}${EXPECTED_VERSION}${NC_BOLD}..."
curl -L https://getcomposer.org/download/${EXPECTED_VERSION}/composer.phar > "${ROOT}"/bin/composer
exitCheck $?

# Fix permissions
println "${NC_BOLD}Setting composer permissions..."
chmod 755 "${ROOT}"/bin/composer
exitCheck $?

# Ensure ~/.composer exists for the Docker container to mount
println "${NC_BOLD}Initializing ~/.composer directory..."
if [ ! -d ~/.composer ]; then
    mkdir ~/.composer
    exitCheck $?
fi

println "${NC_BOLD}Composer ${GREEN}v${EXPECTED_VERSION} ${NC_BOLD}installation complete."
