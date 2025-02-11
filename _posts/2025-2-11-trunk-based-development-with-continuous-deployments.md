---
layout: post
title: Faster Deployments with Trunk-Based Development and Continuous Deployment
excerpt: Learn how Trunk-Based Development and Continuous Deployment can accelerate your delivery pipeline. This real-world case study shows how a single shared branch approach, combined with automated deployments, can simplify collaboration and speed up feature delivery.
---

Trunk-Based Development and Continuous Deployment won't work for everyone. It's not a silver bullet, but it can be a good fit.

Many developers disregard it because they lack either the right mindset or the company's organizational structure seems to be against it. Sometimes there are valid reasons not to use TBD and CD.

This article showcases how one company successfully implemented TBD and CD, suggesting that your organization might be able to do it too.

## Practices

Each organization is different and has unique(-ish) challenges. Each organization has its own culture, processes, and tools. Each organization has developers with different skillsets and levels of pragmatism.

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

There are many different branching strategies, and their names and terminology vary across different sources.

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
    * Allow commit straight to main without PR
    * main branch is always deployable

Which flow is correct also depends on the use case of the application. If you have planned releases and need to support multiple versions, you might need release branches. If you don't have planned releases, you can use GitHub flow or TBD.

* Release and support branches
  * Release branches
  * Support branches
  * Tags for releases

TODO: Image of Git flow and Github flow

* [Release and support branches](https://tleyden.github.io/blog/2014/04/09/a-successful-git-branching-model-with-enterprise-support/)
* [UAT branch](https://medium.com/towards-data-science/how-to-structure-your-git-branching-strategy-by-a-data-engineer-45ff96857bb)
* [Patterns for Managing Source Code Branches](https://martinfowler.com/articles/branching-patterns.html)
* [Git Branching Strategies](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)


## What is Trunk-Based Development?

Trunk-Based Development involves working from a single shared branch of code, often referred to as the "trunk" or "main" branch. This approach eliminates the need for long-lived feature branches, fostering collaboration and simplifying release management.

The goal of TBD is to simplify the release process, reduce deployment times, and encourage a culture of continuous integration and continuous deployments (CI/CD).

Key is to have main branch in a deployable state at all times. Testing is done during the development and during the CI/CD pipeline.

![TBD 1](/images/posts/continuous-deployment/branches-1.png){: width="850" }

TBD promotes the use of feature flags. This allows developers to merge code changes into the trunk without having the whole feature completed. 

Main-branch can contain non working functionality or partial features that are not in use. These do not need to be hidden behind feature flags.

![TBD 2](/images/posts/continuous-deployment/branches-2.png){: width="850" }

TBD promotes short lived feature branches. This reduces the risk of divergence and makes the review process easier.

![Branch Divergence](https://martinfowler.com/articles/branching-patterns/leroy-branch.jpg){: width="450" }

Additionally, feature flags allow developers to release new functionality without deploying new code, giving teams the flexibility to gradually roll out features.

Parameter feature flags can be used to test new functionality in production.

### Git Practices

One of the age-old questions is whether to merge or rebase.

* Merge or rebase?
* Squash or not?

__The important part:__ keep feature branches up to date with the main branch. Use merge if the branch is shared; otherwise, use merge or rebase.

__Should the feature branch history be clean?__ If the branch is going to be squashed, then it's not needed. Clean history can make the review process easier if the request has lots of code.


## The Benefit of Continuous Deployment

With Continuous Deployment, your main branch deploys straight to production. This means that every change you make is __immediately available to users__, __enabling rapid iterations and fixes__ and __reducing the time between releases__.

![CI-CD-CD](/images/posts/continuous-deployment/ci-cd-cd.png){: width="700" }

__Continuous Integration:__ Main-branch is always in a building state and test are passing.

__Continuous Delivery:__ Main-branch deploys to test and is promoted to production

__Continuous Deployment:__ Main deploys straight to production. There can be a separate testing environment, but both are deployed to the same time.

Common depoyment process:

![Deployment Non-TBD](/images/posts/continuous-deployment/deploy-non-tbd.png){: width="700" }

Continuous deployment process:

![Deplyment TBD](/images/posts/continuous-deployment/deploy-tbd.png){: width="700" }

In CD it is possible to have separate testing environments, but both are deployed to the same time.

## Benefits of Trunk-Based Development and Continuous Deployment

* __Simple Workflow:__ No need to manage release branches, tags, etc.
* __Simplified Release Management:__ No need to think and plan releases.
* __Reduced Merge Conflicts:__ Short lived branches mean fewer merge conflicts.
* __Faster Time-to-Market:__ Features, fixes, and changes reach production faster.
* __Encourage Ownership:__ Developers need to test and understand the system better in order to confidently deploy to production.
* __Trust in the Process:__ Developers have confidence that the process will work.
* __Better Collaboration:__ Developers work on smaller, incremental changes, leading to fewer isolated code silos and easier coordination.
* __Faster Feedback:__ Quick deployments mean faster feedback from users and stakeholders.
* __Reduced Risk:__ Smaller, incremental changes are easier to test and rollback if needed.
* __Improved Quality:__ Continuous testing and deployment encourages better testing practices, automation and monitoring.
* __Feature Flags:__ Enable controlled releases without redeploying entire systems.

## Challenges of Trunk-Based Development and Continuous Deployment

While TBD and CD offers numerous benefits, they also presents challenges:

* __Error Proneness:__ More deployments mean more changes that can lead to production errors if not managed properly.
* __Coordination of Systems Changes:__ Integrating multiple systems and deployments simultaneously can be complex.
* __Testing Environments:__ Ensuring that all features are thoroughly tested before merging is essential.
* __"Messy" Git History:__ Commits are not tied to a feature or ready functionality.
* __Team Discipline:__ Developers need strong discipline to keep commits small, maintain code quality and test the code.
* __CI Pipeline Speed:__ Fast feedback loops become crucial as all developers commit to the main branch.
* __Feature Flags Management:__ Increased complexity in managing multiple feature flags and their lifecycle.

## Requirements for Success

To implement Continuous Deployment successfully, your team benefits from:

* __Fast Pull Request Process:__ Automate and streamline code reviews.
* __Automated Tests:__ Ensure code quality with robust test coverage.
* __QA Mindset:__ Foster a culture where developers own testing responsibilities.
* __Monitoring:__ Keep an eye on production performance in real-time.
* __Fast Rollback:__ Implement rollback mechanisms to revert changes quickly.
* __Feature Flags:__ Enable controlled releases without redeploying entire systems.
* __Smoke Tests:__ Quickly verify that new code doesn't break critical functionality.
* __Developer Experience:__ Easy to develop and test all systems.
* __Learning Mindset:__ Encourage continuous learning and improvement through e.g. post-mortems and retrospectives.

None of these are mandatory, but they make the process easier and safer. Which in the end is better for developers mental health.

Developers are pedantic about the code quality and the tests. This is a good thing. But it can also slow down the development. It is important to find the right balance between code quality and speed of development.

Culture change is hard. It takes time and effort to change the way people are used to work.

## Real Life Example

* 5-10 large systems including web frontend, backend, warehouse, data, scripts, custom tools and reporting modules.
* Internal and customer-facing systems.
* 50 developers across 5+ teams.

#### Key Features

* Larger Systems: Systems around single puposes.
* Common "Micro" Services: Services that were used by multiple larger systems.
* Cross-service Communication: Synchronous and asynchronous communication.
* Good and not so good architecture
  * Feature Modules: Modular design for better developer experience.
  * Lava Layers: Long lived systems with multiple different style per system.
* 3rd Party Integrations: Integration with external services.

####  Tools

* Version Control: GitHub with Google Cloud CI/CD pipelines.
* Monorepos: Repository had code and deployment configurations.
* Deployment: Kubernetes for container orchestration.
* Monitoring: Implemented using commercial tools.

#### Architecture

This is only a high level overview of the architecture. It is not a complete picture, but gives you a general idea, that it was not a small or extremely simple system.

External systems had hundreds of thousands of visitors per day. Internal systems had hundreds of users per day.

![Architecture](/images/posts/continuous-deployment/architecture.png){: width="850" }

No team was responsible for a single system, but each team worked on all or most of the systems.


New functionality was often added with better practices in mind. Old working functionality was left as it was or was refactored only when the functionality was changed.


## Learnings

1. **Keep it Simple:** Do not overthink or overcomplicate the process.


### Organization

1. **Speed Over Perfect Stability:** The organization must accept that faster deployments may occasionally cause issues, but the benefit is getting valuable changes to users more quickly.

1. **Good Internal Communication:** Internal teams struggle with constantly changing internal tools, processes, and customer-facing functionality. This can be mitigated with better communication (external communication should not be forgotten).

1. **Embrace Rapid Change:** All teams, not just developers, must be comfortable with frequent updates. Teams need to adapt their mindset to accept quickly changing functionality and be willing to make step-by-step changes to their processes.

1. **Organization Priorities:** Don't let measurement targets slow down improvement. Sometimes achieving long-term goals requires accepting temporary process complexity or manual work.

Note: These lessons apply beyond just Continuous Deployment - they reflect a broader mindset of iterative development and production testing. Start learning and testing as quickly as possible.


### Development

1. **Team Independence:** When a single team can make changes to any system, the whole process becomes simpler as less coordination is needed.

1. **Trading Stability for Developer Experience:** While stability is important, we prioritize faster production updates and better developer experience.

1. **Product and QA Mindset:** Developers need to understand what they are building and why it matters for the product, so they can properly validate and verify functionality.

1. **Faster Development:** Focus only on work that provides value.

1. **Development Environment:** Developers need robust development environments for testing changes, including local instances, Docker, mock servers, up-to-date test data, and mock data.

1. **Test Data for Feature Development:** Having proper test data is crucial for feature development.

1. **More Minor Fixes:** Since commits aren't tied to complete features, team members frequently make small improvement commits.

1. **Trust in Automation:** Have confidence that automated testing will catch most errors.

1. **Manual Smoke Tests:** Manually verify changed functionality in production after deployment.

1. **Accepting Failures:** It's acceptable to break things once, but not acceptable to repeat the same mistake.

1. **Learn from Mistakes:** Use postmortems and retrospectives to learn from inevitable mistakes and improve processes.

1. **Testing in Production:** Use parameter feature flags to safely test new features in production before full rollout.

1. **No Separate QA:** Developers test with product specialists, designers, and product owners.

1. **Quick Issue Resolution:** Address and fix issues immediately when discovered.

1. **Branch Maintenance:** Keep feature branches synchronized with the main branch. Branches should be small and short lived.

1. **Streamlined Review Process:** Code reviews need to be quick and efficient. Review process is always too slow.

1. **Pragmatic Code Quality:** Code merged to main branch doesn't need to be perfect - if it improves the current state, merge it and improve in future PRs. Could it be better? Yes, but it's not a blocker.

1. **Team Mentorship:** Teams need experienced developers to mentor and guide others.

1. **Version Compatibility:** New functionality must work with both current and upcoming versions to ensure smooth transitions.

1. **Regular Cleanup:** Dedicate time to maintaining and cleaning up the codebase.

1. **Temporary Testing Environments:** Maintain separate testing environments when needed for collaboration with designers and other stakeholders.

1. **Monitoring:** It is extremely hard to get monitoring right. Use post-mortems to learn from mistakes and do corrective actions to monitoring alerts.


## Conclusion

Trunk-Based Development with Continuous Deployment can greatly speed up the development and imporve development process and monitoring quality. However, it requires investment in tooling, processes, and team culture. Not every organization needs or is ready for this.