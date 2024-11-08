---
layout: post
title: Test Jekyll Generated GitHub Pages Locally Using Docker
excerpt: Use Docker to test locally GitHub Pages generated with static site generator Jekyll.
---

## Github Pages & Jekyll

You can create a website directly from a [GitHub repository](https://docs.github.com/en/pages). GitHub Pages have a built in support for a static site generator, [Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll).

## Test Locally with Docker

Testing generated pages locally before deploying to GitHub is possible, but [installation of Jekyll](https://jekyllrb.com/docs/installation/) is not extremely simple.

1. Install Ruby
1. Install RubyGems
1. Install GCC and Make
1. Install Jekyll
1. Confgure ...


Easier way is to use Docker image with a correct configuration: [starefossen/github-pages](https://github.com/Starefossen/docker-github-pages)

Start image by going to your __github.io__-directory with Jekyll generated site and mount your directory in a volume under __/usr/src/app__.

```sh
# Linux / macOS
$ docker run --rm -v "$PWD":/usr/src/app -p 4000:4000 starefossen/github-pages

# Windows
$ docker run --rm -v %cd%:/usr/src/app -p 4000:4000 starefossen/github-pages
```

Go to __http://localhost:4000__ and see your page. All changes you make to the files are refreshed automatically.