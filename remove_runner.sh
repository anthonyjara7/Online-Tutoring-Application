#!/bin/bash
# Get GitHub Credentials
GITHUB_TOKEN=$(aws ssm get-parameter --name "/ota/github/token" | jq -r '.Parameter.Value')
GITHUB_OWNER=$(aws ssm get-parameter --name "/ota/github/owner" | jq -r '.Parameter.Value')
GITHUB_REPO=$(aws ssm get-parameter --name "/ota/github/repo" | jq -r '.Parameter.Value')

# Getting remove token from GitHub
RESPONSE=$(curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/actions/runners/remove-token)
TOKEN=$(jq -r '.token' <<< $RESPONSE)

# Removing self-hosted GitHub Action runner configuration
cd /actions-runner
sudo env RUNNER_ALLOW_RUNASROOT="1" ./config.sh remove --token $TOKEN
