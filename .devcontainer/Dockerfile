# Use the base Ubuntu Focal image
FROM ubuntu:focal

# Set environment variables for non-interactive mode
ENV DEBIAN_FRONTEND=noninteractive
ENV DEBCONF_NONINTERACTIVE_SEEN=true

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    bsdmainutils \
    man-db \
    elfutils \
    binutils \
    vim \
    gcc \
    gcc-arm-linux-gnueabihf \
    gcc-mips-linux-gnu \
    gcc-mips64-linux-gnuabi64 \
    gdb \
    nasm \
    git \
    xz-utils \
    curl 

# Download and install Node.js 20.15.0 and npm 10.7.0 using nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" \
    && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
    && nvm install 20 \
    && nvm use 20 \
    && ln -s "$NVM_DIR/versions/node/$(nvm version 20)/bin/node" /usr/bin/node \
    && ln -s "$NVM_DIR/versions/node/$(nvm version 20)/bin/npm" /usr/bin/npm \
    && ln -s "$NVM_DIR/versions/node/$(nvm version 20)/bin/npx" /usr/bin/npx

# Cleanup unnecessary files
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory to /workspace
WORKDIR /workspace
