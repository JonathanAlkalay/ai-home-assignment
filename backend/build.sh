#!/bin/bash

# Version and tag configuration
VERSION="1.0.0"
TAG="latest"

echo "🏗️  Building backend Docker image v${VERSION}..."

# Build the Docker image with version and latest tag
docker build -t ai-posts-backend:${VERSION} .
docker tag ai-posts-backend:${VERSION} ai-posts-backend:${TAG}

echo "✅ Backend Docker image built successfully!"
echo "Image details:"
echo "  - ai-posts-backend:${VERSION}"
echo "  - ai-posts-backend:${TAG}"
echo ""
echo "To run the container, use either:"
echo "docker run -p 3001:3001 ai-posts-backend:${VERSION}"
echo "docker run -p 3001:3001 ai-posts-backend:${TAG}" 