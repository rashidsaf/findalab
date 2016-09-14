# medology/findalab-php
FROM chekote/php:7.0.8

RUN apt-get update && \
    # findalab dependencies
    apt-get install -y php7.0-curl && \

    # Cleanup
    apt-get remove -y && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
