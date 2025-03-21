#!/bin/bash

# Version and tag configuration
VERSION="1.0.0"
TAG="latest"

echo "🏗️  Building frontend Docker image v${VERSION}..."

# Build the Docker image with version and latest tag
docker build -t ai-posts-frontend:${VERSION} .
docker tag ai-posts-frontend:${VERSION} ai-posts-frontend:${TAG}

echo "✅ Frontend Docker image built successfully!"
echo "Image details:"
echo "  - ai-posts-frontend:${VERSION}"
echo "  - ai-posts-frontend:${TAG}"
echo ""
echo "To run the container, use either:"
echo "docker run -p 3000:3000 ai-posts-frontend:${VERSION}"
echo "docker run -p 3000:3000 ai-posts-frontend:${TAG}" 