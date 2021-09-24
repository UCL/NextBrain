#!/usr/bin/env bash

echo "deploying to staging"
rm -rf build
PUBLIC_URL=https://jhughes982.github.io/brain-atlas-staging/ npm run build
cd build
git init
git add .
git commit -m "staging deployment"
git remote add origin https://github.com/jhughes982/brain-atlas-staging.git
#git remote add origin git@github.com:jhughes982/brain-atlas-staging.git
git push --force origin master:gh-pages