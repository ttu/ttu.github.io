---
layout: post
title: Git flow example with commands
excerpt: Git flow example with commands.
---

NOTE: Git flow is often too complex, e.g. [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow) might be enough. Keep it simple.

Branches used in the example:

```
main
production
featureX
hotfix
```

Git tree after the example:

```sh
* d1efb45 (HEAD -> production, main) Add feature2_2
* cfd26e4 Add feature2
* 421f1bf Add hotfix1
* 2f29eda Add feature1
* 907287d New file
* bc657b9 Add base
```

Commands:

```sh
mkdir branch-example && cd branch-example
git init

touch existing_files
git add .
git commit -am "Add base"
git checkout -b production

git checkout main
touch new_file
git add .
git commit -am "New file"
git checkout production
git rebase main

# Crete feature-1 and update main
git checkout main
git checkout -b feature-1
touch feature_1
git add .
git commit -am "Add feature1"

git checkout main
git merge feature-1
git branch -d feature-1

# Push feature to production
git checkout production
git rebase main

# Start feature 2
git checkout -b feature-2
touch feature_2
git add .
git commit -am "Add feature2"

# Create a new hotfix and push it to prod
git checkout production
git checkout -b hotifx-1
touch hotfix_1
git add .
git commit -am "Add hotfix1"

git checkout production
git rebase hotifx-1
git branch -d hotifx-1

git log --graph --all --oneline
# * b2996b8 (HEAD -> production) Add hotfix1
# | * d2898af (feature-2) Add feature2
# |/
# * 2f29eda (main) Add feature1
# * 907287d New file
# * bc657b9 Add base

git checkout main
# Cherry pick lates commit from production
git cherry-pick -x $(git rev-parse production)

git diff production
# Should be empty

git log --graph --all --oneline
# * 421f1bf (HEAD -> main) Add hotfix1
# | * b2996b8 (production) Add hotfix1
# |/
# | * d2898af (feature-2) Add feature2
# |/
# * 2f29eda Add feature1
# * 907287d New file
# * bc657b9 Add base

# main production merge is not needed
# git checkout production
# git merge --no-edit main
# git log --graph --all --oneline

# Finish feature 2 and update main
git checkout feature-2
touch feature_2_b
git add .
git commit -am "Add feature2_2"

git rebase main

git checkout main
git merge feature-2
git branch -d feature-2

git log --graph --all --oneline
# * d1efb45 (HEAD -> main) Add feature2_2
# * cfd26e4 Add feature2
# * 421f1bf Add hotfix1
# | * b2996b8 (production) Add hotfix1
# |/
# * 2f29eda Add feature1
# * 907287d New file
# * bc657b9 Add base

# Update feature 2 to production
git checkout production
git rebase main

git log --graph --all --oneline
# * d1efb45 (HEAD -> production, main) Add feature2_2
# * cfd26e4 Add feature2
# * 421f1bf Add hotfix1
# * 2f29eda Add feature1
# * 907287d New file
# * bc657b9 Add base
```