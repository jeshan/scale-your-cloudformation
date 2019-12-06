# Scale your Cloudformation: success tactics for getting more out of Infrastructure as Code on AWS

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
