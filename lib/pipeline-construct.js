const { Construct, Duration } = require('@aws-cdk/core');
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
        new Project(this, 'deploy-site', {
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
                        commands: ['cdk diff || true', 'cdk deploy'],
                    },
                },
            }),
        });
    }
}

module.exports = { PipelineConstruct };
