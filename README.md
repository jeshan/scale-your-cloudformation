# Scale your Cloudformation: success tactics for getting more out of Infrastructure as Code on AWS

![](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiSWVBZnBKMnRxRnl6Q1kydUZCZFV5eVd2Q3h4eVE3MXI5VlJoVEdKZEJvLzExSWQvNGFXZUNvL3pXZW43VGVMc20vV1FoaTh3TzhVSDhtN3FiNTRvYnRRPSIsIml2UGFyYW1ldGVyU3BlYyI6IjBjSmlZTTZwalRkbEdEM2UiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

In this guide, you will learn:
- Mistakes to avoid when adopting cloudformation at scale
- Free tools to generate cloudformation templates
- Misconceptions about Cloudformation
- How to work faster with cloudformation with tools to dramatically increase your turnaround time
- Infrastructure as Code practices and what they imply for you
- How to analyse your infrastructure for security issues
- How to generate your diagrams for your AWS cloud architecture

## Ways to read this guide
1. Browse the [docs](docs/) directory here on GitHub.
2. Read on the website: https://scaleyourcloudformation.com

# TODO:
- cover AWS CDK

# Note to forkers:
This project uses docsify to convert the markdown files into a simple static website.

-  `npm i docsify-cli -g`
- `docsify serve docs`
- Open browser at http://localhost:3000
- Edit files and see changes reloaded live

## Deploying on AWS
Uses the AWS CDK. See [lib/pipeline-construct.js](lib/pipeline-construct.js) for details on the deployment pipeline.
- `npm i -g aws-cdk`
- `cdk deploy`

This is what the CDK will deploy:

![](/diagram.png)

*Image automatically generated with [cfnbuddy](https://www.cfnbuddy.com)*


# Legal
Released under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)

https://creativecommons.org/licenses/by-nc-sa/4.0/
