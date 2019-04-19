#!/bin/bash
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
REMOTE_VERSION=$(npm show @fusionworks/advanced-logger version)
LAST_AUTHOR="$(git log -1 --pretty=format:'%an')"
echo "Local version: $PACKAGE_VERSION"
echo "Remote version: $REMOTE_VERSION"
  
if [[ $PACKAGE_VERSION != $REMOTE_VERSION ]]; then
  echo "Version mismatch. Skip deploy."
elif [[ $LAST_AUTHOR == "Travis CI User" ]]; then 
  echo "Skip deploy as last commit was made by travis."
elif [[ $TRAVIS_PULL_REQUEST = false && $TRAVIS_BRANCH == "master" ]]; then
  git checkout master
  git pull origin master
  npm run release
  # https://github.com/FusionWorks/advanced-logger.git
  git push "https://${GITHUB_TOKEN}@github.com/FusionWorks/advanced-logger.git" master

	git checkout -
else
	echo "Thats not master or pull-request to master. Skip deploy."
fi