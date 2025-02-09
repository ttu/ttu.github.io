---
layout: post
title: Git Rebase Example with Commands
excerpt: Example of git rebase with commands and how "reuse recorded resolutions" might save some conflict resolution time.
---

Create a new directory, initialize a new git repository and add a simple script to main branch.

```sh
mkdir git-rebase-demo
cd git-rebase-demo
git init

echo '# script.py - Git rebase demo

def greet():
    print("Hello, world!")

if __name__ == "__main__":
    greet()
' > script.py

git add script.py
git commit -m "M1: Initial commit - Add greet function"
```

Create a new branch from the main branch and change the `greet()` function and add a new `farewell()` function.

```sh
git checkout -b feature-branch

echo '# script.py - Git rebase demo

def greet():
    print("Hello, from the feature branch!")

def farewell():
    print("Goodbye, world!")

if __name__ == "__main__":
    greet()
    farewell()
' > script.py

git commit -am "F1: Add farewell function"
```

Add a missing comment to the greet function and create a new commit.


```sh
echo '# script.py - Git rebase demo

def greet():
    print("Hello, from the feature branch!") # Changed in the feature branch

def farewell():
    print("Goodbye, world!")

if __name__ == "__main__":
    greet()
    farewell()
' > script.py

git commit -am "F2: Add comment to greet function"
```

Change the line in the `greet()` function on the `main` branch.


```sh
git checkout main

echo '# script.py - Git rebase demo

def greet():
    print("Hello, Universe!")  # Changed in main

if __name__ == "__main__":
    greet()
' > script.py

git commit -am "M2: Update greet function to say 'Hello, Universe!'"
```

Rebase the `feature-branch` on top of the `main` branch.

```sh
git checkout feature-branch
git rebase main
```

This will result in conflicts with both commits. You'll need to resolve these conflicts manually in your editor.

```sh
git add script.py
git rebase --continue
```

Confirm that the rebase is complete.

```sh
git log --oneline --graph --all
```

Add new changes to the `feature-branch` and commit them.

```sh
echo '# script.py - Git rebase demo

def greet():
    print("Hello, Universe!")  # Changed in main

def farewell():
    print("Goodbye, Universe!") # Make this to match the main branch

if __name__ == "__main__":
    greet()
    farewell()
' > script.py

git commit -am "F3: Make farewell function match the main branch"
```

Add new function to main branch.

```sh
git checkout main

echo '# script.py - Git rebase demo


def greet():
    print("Hello, Universe!")  # Changed in main


def optional_greet():
    print("Hello, optional!")


if __name__ == "__main__":
    greet()
    optional_greet()
' > script.py

git commit -am "M3: Add optional greet function"
```

```sh
git checkout feature-branch
git rebase main
```

Now we have to fix conflicts from the main branch with 3 different commits. We already resolved the first 2 conflicts last time.

Add the "reuse recorded resolution" setting to git and try again.

```sh
git config --global rerere.enabled true
```

It remembers how conflicts were resolved previously and it applies those same resolutions again.