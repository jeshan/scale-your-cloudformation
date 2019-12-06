const { Bucket } = require('@aws-cdk/aws-s3');
const {
    CfnCloudFrontOriginAccessIdentity,
    CloudFrontWebDistribution,
} = require('@aws-cdk/aws-cloudfront');
const { CanonicalUserPrincipal } = require('@aws-cdk/aws-iam');
const path = require('path');
const { PipelineConstruct } = require('./pipeline-construct');
const { BucketDeployment, Source } = require('@aws-cdk/aws-s3-deployment');

const { Stack, RemovalPolicy } = require('@aws-cdk/core');
const {
    Certificate,
    ValidationMethod,
} = require('@aws-cdk/aws-certificatemanager');

class CdkStack extends Stack {
    /**
     *
     * @param {cdk.Construct} scope
     */
    constructor(scope) {
        super(scope, 'scale-your-cloudformation');

        const domainName = 'scaleyourcloudformation.com';
        const cert = new Certificate(this, 'cert', {
            domainName,
            validationMethod: ValidationMethod.DNS,
        });

        const websiteBucket = new Bucket(this, 'WebsiteBucket', {
            domainName,
            removalPolicy: RemovalPolicy.DESTROY,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'error.html',
        });

        const originId = new CfnCloudFrontOriginAccessIdentity(
            this,
            'OriginAccessIdentity',
            {
                cloudFrontOriginAccessIdentityConfig: {
                    comment: `CloudFront OriginAccessIdentity for ${websiteBucket.bucketName}`,
                },
            },
        );

        websiteBucket.grantRead(
            new CanonicalUserPrincipal(originId.attrS3CanonicalUserId),
        );

        let s3OriginConfig = {
            originAccessIdentityId: originId.ref,
            s3BucketSource: websiteBucket,
        };

        const distributionConfig = {
            originConfigs: [
                {
                    s3OriginSource: {
                        ...s3OriginConfig,
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                },
            ],
            aliasConfiguration: {
                acmCertRef: cert.certificateArn,
                names: [domainName],
            },
        };
        let distribution = new CloudFrontWebDistribution(
            this,
            'WebSiteDistribution',
            distributionConfig,
        );

        const placeHolderSource = path.join(__dirname, '..', 'docs');

        new BucketDeployment(this, 'WebsiteDeployment', {
            sources: [Source.asset(placeHolderSource)],
            destinationBucket: websiteBucket,
            distribution,
            retainOnDelete: false,
        });

        new PipelineConstruct(this);
    }
}

module.exports = { CdkStack };
