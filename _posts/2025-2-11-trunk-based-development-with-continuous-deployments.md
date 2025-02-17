---
layout: post
title: Faster Deployments with Trunk-Based Development and Continuous Deployment
excerpt: Learn how Trunk-Based Development and Continuous Deployment can speed up your delivery pipeline. This real-world example shows how a single shared branch approach, combined with continuous deployments, can simplify release management and speed up feature delivery.
---

Trunk-Based Development and Continuous Deployment won't work for everyone. It's not a silver bullet, but it can be a good fit.

Many developers disregard it because they lack either the right mindset or the company's organizational structure seems to be against it. Sometimes there are valid reasons not to use TBD and CD.

This article showcases how one company successfully implemented TBD and CD, suggesting that your organization might be able to do it too.

## Practices

Each organization is different and has unique(-ish) challenges. Each organization has its own culture, processes, and tools. Each organization has developers with different skillsets and levels of pragmatism.

Each organization has its own way of doing things. Some practices have evolved over years to fit the organization's needs, while others are simply just "randomly" chosen practices that have been kept for no good reason.

* Branching Strategies
  * Git flow
  * GitHub flow
  * Trunk based development
  * Release, support branches, tags etc.
* Git Practices
  * Merge or rebase?
  * Squash or not?
* Testing Practices
  * Unit tests
  * Integration tests
  * E2E tests
  * Smoke tests
  * QA
* Environment needs
  * Local
  * Development
    * Might break at any moment
  * Testing
    * Developement, QA, UAT...
  * Staging
    * Should match production as close as possible
  * Production

### Branching Strategies

There are many different branching strategies, and their names, terminology and definitions vary across different sources. Currently most popular seems to be Trunk-Based Development (TBD), GitHub flow and Git flow.

* Git flow
  * Classic branching strategy
  * Long lived feature branches
  * Development branch, release branch, hotfix branch, etc.
* GitHub flow
  * Feature branches
  * Promotes PR review process
  * Main branch doesn't have to be deployable
* Trunk-based development
  * Short lived feature branches
  * Main branch is always deployable
  * Theoretical difference to GitHub flow (depends on the source)
    * Feature branches are short lived
    * Allow commit straight to main without PR (some define that using other branches is not allowed)
    * main branch is always deployable


<br/>

![Git flow](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*hmZzuG8oU7fqsnpfTgKDUw.png){: width="600" }

_Git Flow_ (original source of image is unknown)

![GitHub flow](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*bvubr15Z_l3UknX1w8Mx1A.png){: width="600" }

_GitHub Flow_ (original source of image is unknown)

<br/>
Which flow is correct also depends on the use case of the application. 

If you have planned releases or need to support multiple versions, you need release branches (Git flow, Github flow with release branches). If you don't have planned releases, you can use GitHub flow or TBD.

If you have an extremely demanding quality requirements, you might need to use testing and staging environments before releasing to production.

* Release and support branches
  * Release branches
  * Support branches
  * Tags for releases


Links:
* [Git-Flow vs GitHub-Flow](https://medium.com/@dimiak_/demystify-git-branching-strategies-choose-the-best-for-you-8f08b9cad3b3)
* [Demystify Git Branching Strategies — Choose the best for you.](https://medium.com/@dimiak_/demystify-git-branching-strategies-choose-the-best-for-you-8f08b9cad3b3)
* [Release and support branches](https://tleyden.github.io/blog/2014/04/09/a-successful-git-branching-model-with-enterprise-support/)
* [UAT branch](https://medium.com/towards-data-science/how-to-structure-your-git-branching-strategy-by-a-data-engineer-45ff96857bb)
* [Patterns for Managing Source Code Branches](https://martinfowler.com/articles/branching-patterns.html)
* [Git Branching Strategies](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)


## What is Trunk-Based Development?

Trunk-Based Development involves working from a single shared branch of code, often referred to as the "trunk" or "main" branch. 

The goal of TBD is to simplifying version control usage, maintain stable codebase and to help achieve continuous deployment.

Key is to have main branch in a deployable/stable state at all times. Manual testing is done during the development and automated tests during the CI/CD pipeline.

![TBD 1](/images/posts/continuous-deployment/branches-1.png){: width="850" }

TBD promotes the use of feature flags. This allows developers to merge code changes into the trunk without having the whole feature completed. Main-branch can contain new functionality that will replace old functionality, non working functionality or partial features that are not in use. These do not need to be hidden behind feature flags.

![TBD 2](/images/posts/continuous-deployment/branches-2.png){: width="850" }

Having 2 different versions of the same functionality at the same time is not uncommon in TBD. In A/B testing it is also common to have 2 or more versions of the same feature, so it is not only a thing in TBD.

As features don't need to be completed before merging to main, branches can be short lived. This reduces the risk of divergence and makes the review process easier.

![Branch Divergence](https://martinfowler.com/articles/branching-patterns/leroy-branch.jpg){: width="450" }

(image from: [Patterns for Managing Source Code Branches](https://martinfowler.com/articles/branching-patterns/leroy-branch.jpg))

Additionally, feature flags allow developers to release new functionality without deploying new code, giving teams the flexibility to gradually roll out features.

Enabling feature flags to be used e.g. with parameters allows testing new functionality in production, before it is released to all users. `www.mysite.com/app?featureV2=true`

Good example of how TBD can simplify the development process is hotfixing. Normally there needs to be a separate release branch for hotfixes.

![Hotfix from branch](/images/posts/continuous-deployment/hotfix-to-production.png){: width="850" }

In TBD as all commits are deployed to production, hotfix is created directly to main branch or merged to main from a new branch and deployed to production immediately.

## Git Practices

One of the age-old questions is whether to merge or rebase.

* Merge or rebase?
* Squash or not?

__The important part:__ keep feature branches up to date with the main branch. Use merge if the branch is shared; otherwise, use merge or rebase.

__Should the feature branch history be clean?__ If the branch is going to be squashed, then it's not needed. Clean history can make the review process easier if the request has lots of code.


## The Benefit of Continuous Deployment

With Continuous Deployment, your main branch deploys straight to production. This means that every change you make is __immediately available to users__, __enabling rapid iterations and fixes__ and __reducing the time between releases__.

![CI-CD-CD](/images/posts/continuous-deployment/ci-cd-cd.png){: width="700" }

__Continuous Integration:__ Main-branch is always in a building state and test are passing.

__Continuous Delivery:__ Main-branch deploys to test and is manually promoted to production

__Continuous Deployment:__ Main deploys straight to production. There can be a separate testing environment, but both are deployed to the same time.

Common depoyment process:

![Deployment Non-TBD](/images/posts/continuous-deployment/deploy-non-tbd.png){: width="700" }

Continuous deployment process:

![Deplyment TBD](/images/posts/continuous-deployment/deploy-tbd.png){: width="700" }

In CD it is possible to have separate testing environments and deployment is done simultaneously to all environments.

![Deplyment TBD with separate testing environments](/images/posts/continuous-deployment/deploy-tbd-test-env.png){: width="700" }


## Benefits of Trunk-Based Development and Continuous Deployment

* __Technical Benefits__
  * __Simple Workflow:__ No need to manage release branches, tags, etc.
  * __Simplified Release Management:__ No need to think and plan releases.
  * __Reduced Merge Conflicts:__ Short lived branches mean fewer merge conflicts.
  * __Reduced Risk:__ Smaller, incremental changes are easier to test and rollback if needed.
  * __Faster Time-to-Market:__ Features, fixes, and changes reach production faster.
  * __Feature Flags:__ Enable controlled releases without redeploying entire systems.
* __Team Benefits__
  * __Better Collaboration:__ Developers work on smaller, incremental changes, leading to fewer isolated code silos and easier coordination.
  * __Improved Quality:__ Continuous testing and deployment encourages better testing practices, automation and monitoring.
  * __Understanding of the Product:__ Developers need to understand the product (and business) to be able to test it.
  * __Undestanding the System:__ Developers need to understand the system to test and monitor it effectively.
* __Developer Benefits__
  * __Increased Responsibility:__ Developers need to be responsible for not breaking the system.
  * __Encourage Ownership:__ Developers need to test and understand the system better to confidently deploy to production.
  * __System Development Experience:__ Developers are able to develop and test all systems and have access to required infrastructure, monitoring etc.


## Challenges of Trunk-Based Development and Continuous Deployment

While TBD and CD offers numerous benefits, they also presents challenges:

* __Team Discipline:__ Developers need strong discipline to keep commits small, maintain code quality and test the code.
* __Error Proneness:__ More deployments mean more changes that can lead to production errors if not managed properly.
* __Testing Environments:__ Ensuring that all features are thoroughly tested before merging is essential.
* __CI Pipeline Speed:__ Fast feedback loops become crucial as all developers commit to the main branch.
* __Coordination of Systems Changes:__ Integrating multiple systems and deployments simultaneously can be complex.
* __Feature Flags Management:__ Increased complexity in managing multiple feature flags and their lifecycle.
* __"Messy" Git History:__ Commits are not tied to a feature or ready functionality.


## Requirements for Success

To implement Continuous Deployment successfully, your organization benefits from:

* __QA (Product) Mindset:__ Developers should understand the product and own testing responsibilities.
* __Developer Experience:__ Easy to develop and test all systems.
* __Fast Pull Request Process:__ Automate and streamline code reviews.
* __Automated Tests:__ Ensure functionality keeps on working with automated tests.
* __Monitoring:__ Monitoring and alerting for production systems.
* __Fast Rollback:__ Rollback mechanisms to revert changes quickly or roll back to a previous version.
* __Feature Flags:__ Enable controlled releases without redeploying entire systems.
* __Smoke Tests:__ Quickly verify that new code doesn't break critical functionality.
* __Learning Mindset:__ Encourage continuous learning and improvement through e.g. post-mortems and retrospectives.

None of these are mandatory, but they make the process easier and safer. This in the end is better for developers mental health, as they are not stressed about the production stability.

Developers are pedantic about the code quality and the tests. This is a good thing, but it can also slow down the development. It is important to find the right balance between code quality and speed of development.

Culture change is hard. It takes time and effort to change the way people are used to work.


## Real-World Example

Let's look at an e-commerce organization that managed both buying and selling operations. Their systems included multiple interconnected systems: an e-commerce platform, warehouse management, order processing, product verification, and procurement systems, etc.

The customer-facing systems handled hundreds of thousands of daily visitors, while internal tools served hundreds of employees. The platform processed thousands of orders daily, requiring reliable deployment practices to maintain system stability. Crashing the systems affected immediate revenue or halted the work of tens or hundreds of employees.

### System Overview

* 5-10 major systems including web frontend, backend, warehouse, data processing, scripts, custom tools, and reporting modules
* Both internal and customer-facing systems
* 50 developers across 5+ teams
* Teams organized around domains or products, including developers, designers, and product owners
* Teams worked across multiple systems within their domain, rather than owning single systems
* Tech stack: TypeScript, Python, PostgreSQL, Redis, React, Node.js, Kubernetes, GCP, GitHub

### Key Features

* Large Systems: Each system focused on a single purpose
* Common Services: Shared services used across multiple larger systems
* Cross-service Communication: Mix of synchronous and asynchronous communication
* Architecture Quality
  * Feature Modules: Modular design for improved developer experience
  * Lava Layers: Long-running systems with varying architectural styles
* Third-party Integrations: Connected with external services

### Tools

* Monorepos: Repositories containing both application and infrastructure code, sometimes combining frontend and backend
* CI/CD: GitHub with Google Cloud pipelines
* Deployment: Kubernetes for container orchestration
* Monitoring: Commercial monitoring solutions

### Architecture

This high-level overview provides a general understanding of the system's complexity, though it's not a complete picture.

![Architecture](/images/posts/continuous-deployment/architecture.png){: width="850" }

New features were implemented using current best practices, while existing functionality was preserved and only refactored when changes were required.


### Key Learnings

#### Fundamental Principle

1. **Keep it Simple:** Do not overthink or overcomplicate the process.

#### Organizational Mindset

1. **Speed Over Perfect Stability:** The organization must accept that faster deployments may occasionally cause issues, but the benefit is getting valuable changes to users more quickly.
2. **Good Internal Communication:** Internal teams struggle with constantly changing internal tools, processes, and customer-facing functionality. This can be mitigated with better communication (external communication should not be forgotten).
3. **Embrace Rapid Change:** All teams, not just developers, must be comfortable with frequent updates. Teams need to adapt their mindset to accept quickly changing functionality and be willing to make step-by-step changes to their processes.
4. **Organization Priorities:** Don't let measurement targets slow down improvement. Sometimes achieving long-term goals requires accepting temporary process complexity or manual work.

Note: These lessons apply beyond just Continuous Deployment - they reflect a broader mindset of iterative development and production testing. Start learning and testing as quickly as possible.


#### Development

##### Team and Process

1. **Team Independence:** When a single team can make changes to any system, the whole process becomes simpler as less coordination is needed.
2. **Team Mentorship:** Teams need experienced developers to mentor and guide others.
3. **No Separate QA:** Developers test with product specialists, designers, and product owners.
4. **Product and QA Mindset:** Developers need to understand what they are building and why it matters for the product, so they can properly validate and verify functionality.

##### Development Workflow

1. **Faster Development:** Focus only on work that provides value.
2. **More Minor Fixes:** Since commits aren't tied to complete features, team members frequently make small improvement commits.
3. **Branch Maintenance:** Keep feature branches synchronized with the main branch. Branches should be small and short lived.
4. **Streamlined Review Process:** Code reviews need to be quick and efficient. Review process is always too slow.
5. **Version Compatibility:** New functionality must work with both current and upcoming versions to ensure smooth transitions.

##### Quality and Testing

1. **Development Environment:** Developers need robust development environments for testing changes, including local instances, Docker, mock servers, up-to-date test data, and mock data.
2. **Test Data for Feature Development:** Having proper test data is crucial for feature development.
3. **Trust in Automation:** Have confidence that automated testing will catch most errors.
4. **Manual Smoke Tests:** Manually verify changed functionality in production after deployment.
5. **Testing in Production:** Use parameter feature flags to safely test new features in production before full rollout.
6. **Temporary Testing Environments:** Maintain separate testing environments when needed for collaboration with designers and other stakeholders.

##### Maintenance and Improvement

1. **Trading Stability for Developer Experience:** While stability is important, we prioritize faster production updates and better developer experience.
2. **Quick Issue Resolution:** Address and fix issues immediately when discovered.
3. **Pragmatic Code Quality:** Code merged to main branch doesn't need to be perfect - if it improves the current state, merge it and improve in future PRs. Could it be better? Yes, but it's not a blocker.
4. **Regular Cleanup:** Dedicate time to maintaining and cleaning up the codebase.

##### Learning and Monitoring

1. **Accepting Failures:** It's acceptable to break things once, but not acceptable to repeat the same mistake.
2. **Learn from Mistakes:** Use postmortems and retrospectives to learn from inevitable mistakes and improve processes.
3. **Monitoring:** It is extremely hard to get monitoring right. Use post-mortems to learn from mistakes and do corrective actions to monitoring alerts.


## Conclusion

Trunk-Based Development with Continuous Deployment can greatly speed up the development and imporve development process and monitoring quality. However, it requires investment in tooling, processes, and team culture. Not every organization needs or is ready for this.