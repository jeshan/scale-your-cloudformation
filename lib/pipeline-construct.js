const { PolicyStatement } = require('@aws-cdk/aws-iam');
const { Construct, Duration, Stack } = require('@aws-cdk/core');
const {
    Project,
    BuildSpec,
    EventAction,
    LinuxBuildImage,
    Source,
    FilterGroup,
} = require('@aws-cdk/aws-codebuild');

class PipelineConstruct extends Construct {
    constructor(scope) {
        super(scope, 'pipeline');
        let project = new Project(this, 'deploy-site', {
            description: 'Deploys website at scaleyourcloudformation.com',
            timeout: Duration.minutes(30),
            source: Source.gitHub({
                cloneDepth: 1,
                owner: 'jeshan',
                repo: 'scale-your-cloudformation',
                webhookFilters: [
                    FilterGroup.inEventOf([EventAction.PUSH]).andBranchIs(
                        'master',
                    ),
                ],
            }),
            environment: { buildImage: LinuxBuildImage.STANDARD_2_0 },
            buildSpec: BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        'runtime-versions': {
                            nodejs: '10',
                        },
                    },
                    pre_build: {
                        commands: ['npm i -g aws-cdk@1.16.3', 'npm i'],
                    },
                    build: {
                        commands: [
                            'cdk bootstrap',
                            'cdk diff || true',
                            'cdk deploy',
                        ],
                    },
                },
            }),
        });
        let { account, region, stackName } = Stack.of(this);
        project.addToRolePolicy(
            new PolicyStatement({
                resources: [
                    `arn:aws:cloudformation:${region}:${account}:stack/CDKToolkit/*`,
                    `arn:aws:cloudformation:${region}:${account}:stack/${stackName}*/*`,
                ],
                actions: ['cloudformation:DescribeStacks'],
            }),
        );
        project.addToRolePolicy(
            new PolicyStatement({
                resources: [
                    `arn:aws:cloudformation:${region}:${account}:stack/${stackName}*/*`,
                ],
                actions: [
                    'cloudformation:GetTemplate',
                    'cloudformation:CreateChangeSet',
                    'cloudformation:DescribeChangeSet',
                    'cloudformation:ExecuteChangeSet',
                    'cloudformation:DescribeStackEvents',
                    'cloudformation:DeleteChangeSet',
                    'cloudformation:DeleteStack',
                ],
            }),
        );
        project.addToRolePolicy(
            new PolicyStatement({
                resources: ['arn:aws:s3:::cdktoolkit-stagingbucket-*'],
                actions: ['s3:*Object', 's3:ListBucket'],
            }),
        );
        project.addToRolePolicy(
            new PolicyStatement({
                resources: [`arn:aws:iam::${account}:role/${stackName}*`],
                actions: [
                    'iam:CreateRole',
                    'iam:GetRole',
                    'iam:PassRole',
                    'iam:UpdateRole',
                    'iam:DeleteRole',
                    'iam:AttachRolePolicy',
                    'iam:DetachRolePolicy',
                    'iam:PutRolePolicy',
                    'iam:DeleteRolePolicy',
                    'iam:GetRolePolicy',
                ],
            }),
        );
        project.addToRolePolicy(
            new PolicyStatement({
                resources: ['*'],
                actions: ['acm:RequestCertificate'],
            }),
        );
        project.addToRolePolicy(
            new PolicyStatement({
                resources: [`arn:aws:acm:${region}:${account}:certificate/*`],
                actions: ['acm:DeleteCertificate', 'acm:DescribeCertificate'],
            }),
        );
        project.addToRolePolicy(
            new PolicyStatement({
                resources: [`arn:aws:s3:::${stackName}*`],
                actions: [
                    's3:CreateBucket',
                    's3:DeleteBucket',
                    's3:PutBucketWebsite',
                    's3:GetBucketPolicy',
                    's3:PutBucketPolicy',
                    's3:DeleteBucketPolicy',
                ],
            }),
        );
        project.addToRolePolicy(
            new PolicyStatement({
                resources: [
                    `arn:aws:codebuild:${region}:${account}:project/pipelinedeploysite*`,
                ],
                actions: [
                    'codebuild:CreateProject',
                    'codebuild:UpdateProject',
                    'codebuild:DeleteProject',
                    'codebuild:CreateWebhook',
                    'codebuild:UpdateWebhook',
                    'codebuild:DeleteWebhook',
                ],
            }),
        );
        project.addToRolePolicy(
            new PolicyStatement({
                resources: ['*'],
                actions: ['cloudfront:*CloudFrontOriginAccessIdentity*'],
            }),
        );
        project.addToRolePolicy(
            new PolicyStatement({
                resources: [
                    `arn:aws:lambda:${region}:${account}:function:${stackName}*`,
                ],
                actions: ['lambda:*Function*'],
            }),
        );
        project.addToRolePolicy(
            new PolicyStatement({
                resources: [`arn:aws:cloudfront::${account}:distribution/*`],
                actions: [
                    'cloudfront:*Distribution*',
                    'cloudfront:*agResource',
                ],
            }),
        );
    }
}

module.exports = { PipelineConstruct };
