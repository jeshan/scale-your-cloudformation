# CloudFormation’s shortcomings (and how to deal with them)
## Delayed support for new features/resources
AWS releases many enhancements but the Cloudformation team has a separate roadmap on when they will support the new resources/features. This means that sometimes.
It’s a [hit-and-miss](https://www.reddit.com/r/aws/comments/at2dk6/cloudformation_synonym_for_sucks/eh0r5ui?utm_source=share&utm_medium=web2x) for its main alternative, TF, too ([full reddit thread](https://www.reddit.com/r/aws/comments/at2dk6/cloudformation_synonym_for_sucks/)).

If it’s important for you to manage these resources under Cloudformation, you can either:
use the custom resource feature to represent the new resource
create the resources via the API or SDKs. Use [Former2](tools.md#former2) to get the exact code to do this.

These 2 solutions should be used only as a workaround until the Cloudformation team officially supports them.

## Delayed turnaround if template contains mistakes
There are resources which take a while to provision and Cloudformation waits for them to stabilise before completing. Examples: RDS and ElastiCache clusters. If there are mistakes in your templates, it may take a while for you to be notified and Cloudformation rolls the latest changes back. This delayed turnaround is frustrating and loses valuable time.

The following solution is not ideal but it works:
Create the resource manually via AWS management console. It will guide you towards setting valid parameters.
When it’s complete, use a [template generator](tools.md#template-generator-tools) to get the resource’s Cloudformation definition.
Save this definition in a template
Delete the manually created resource.
Use the template to recreate the resource

## Limited support for lookups
Sometimes it’s useful to look for values that you’d rather not hardcode (an AMI ID, a dns record, etc). Cloudformation does not have direct support for these. 

### Custom resources
The most powerful solution is to use custom resources. These are Lambda functions that can run arbitrary code to look for arbitrary values.
Here are some examples:
- Look up AMis ([Walkthrough: Looking Up Amazon Machine Image IDs](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/walkthrough-custom-resources-lambda-lookup-amiids.html))
- Lookup NS records in a hosted zone ([Lookup NS records by domain name](https://github.com/base2Services/cloudformation-custom-resources-nodejs/tree/develop/lookup-ns-records))

### Use the sceptre-aws-resolver plugin for Sceptre
The plugin [sceptre-aws-resolver](https://github.com/jeshan/sceptre-aws-resolver) allows you to read any AWS API easily if you’re using [Sceptre](tools.md#sceptre).
The readme page shows how easy it is to get started. Example reading and decrypting a System Manager parameter:

`!aws ssm::get_parameter::'Name':'your-secret-param','WithDecryption':True::Parameter.Value`

## Configuration drift
Cloudformation likes it when you update resources only through it, and not some external step like point-and-click. Sometimes, people do it out of necessity, e.g fixing an outage to restore service to their applications as soon as possible. If these changes are not reflected in the template, it means that template has “drifted” from the resource, i.e the configuration file does not match exactly what was deployed. AWS provides a feature to mitigate this: [Drift Detection](https://aws.amazon.com/about-aws/whats-new/2018/11/aws-cloudformation-now-supports-drift-detection/). You can invoke it through the API and it can tell you for a certain stack if its resources don’t match expected values. Furthermore, AWS provides an AWS Config rule to automatically run these checks called [cloudformation-stack-drift-detection-check](https://docs.aws.amazon.com/config/latest/developerguide/cloudformation-stack-drift-detection-check.html?shortFooter=true). Use it as an additional tool in your infra automation toolset.


## Cannot manage (most) existing resources
Historically, you could not ask Cloudformation to start managing your existing resources; you must recreate them as part of a certain stack.

> Since 2019, you can have CFN import some resources. However, you can do that for only about [50 resource types](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resource-import-supported-resources.html).
 
Therefore, if you want to use Cloudformation as much as possible, you must:
1. write the equivalent resource definition in Cloudformation syntax,
2. create the stack and then
3. delete the old resource.

In this document, you will learn a few free tools on how to generate these cloudformation snippets.
