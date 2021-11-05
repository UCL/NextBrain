#!/usr/bin/env bash

echo "deploying to staging environment"
rm -rf build
PUBLIC_URL=https://github-pages.ucl.ac.uk/BrainAtlas-staging/ npm run build
cd build
git init
git add .
git commit -m "staging deployment"
git remote add origin git@github.com:UCL/BrainAtlas-staging.git
git push --force origin master:gh-pages