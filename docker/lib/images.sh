#!/usr/bin/env bash

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../" && pwd)"

export NODE_HOST=registry.hub.docker.com
export NODE_OWNER=chekote
export NODE_REPO=node
export NODE_TAG=11.4.0
export NODE_IMAGE=${NODE_HOST}/${NODE_OWNER}/${NODE_REPO}:${NODE_TAG}

export YARN_HOST=registry.hub.docker.com
export YARN_OWNER=chekote
export YARN_REPO=node
export YARN_TAG=11.4.0
export YARN_IMAGE=${YARN_HOST}/${YARN_OWNER}/${YARN_REPO}:${YARN_TAG}

export SELENIUM_HOST=registry.hub.docker.com
export SELENIUM_ACCOUNT=selenium
export SELENIUM_REPO=standalone-chrome-debug
export SELENIUM_TAG=3.14.0-dubnium
export SELENIUM_IMAGE=${SELENIUM_HOST}/${SELENIUM_ACCOUNT}/${SELENIUM_REPO}:${SELENIUM_TAG}

export SED_REPO=alpine
export SED_TAG=3.8