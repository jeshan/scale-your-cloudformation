# 5 misconceptions about CloudFormation
There are some misconceptions about Cloudformation online. Here are the top ones.

## “It is AWS only, therefore lock-in”
This has historically been true but no longer. For the past couple of years, we now have the opportunity to create custom resources. These are achieved with serverless (AWS Lambda) functions. Since Lambda can run arbitrary code, you can make it create arbitrary resources. It’s more accurate to describe it AWS-centric, not AWS-specific.


## “Just use Terraform”
Adopting Terraform (TF) does not mean that the important issues go away. For example, TF does not support rollbacks and this is a key feature of Infrastructure as Code tools. If deployments fail, e.g multiple people are deploying the same thing at the time, you may run into issues getting your infrastructure in the desired state. With Cloudformation, the stack will be “locked” while the update finishes, hence preventing conflicting updates to happen.


## “It’s not open-source, therefore don’t get features quickly”
This is a hit-and-miss for the open source Terraform as well. Some features may be implemented quickly, others not.

The Cloudformation team has repeatedly said that they intend to decrease the turnaround time and in 2019, they seem to be doing a reasonable job at it.


## “You must _always_ write the template first, then deploy it.”
Many people recommend a “Cloudformation-first” strategy for good reasons. Templates offer many advantages over point-and-click on the AWS management console. For example, when having your resources described in the template means that you can always keep track of what you have deployed.

However, using just Cloudformation or the SDK has disadvantages over point-and-click too. As such, you won’t get wizards that AWS provides on the management console. Sometimes there are multiple steps involved in getting infrastructures right, e.g creating a NAT gateway involves:

- Choosing a public subnet in which to deploy the NAT gateway
- A VPC elastic IP to attach to the gateway
- a route to private subnets’ route tables.

If you used the management console, AWS would show you the steps needed to get this done. This process is much less obvious when you’re in your text editor writing templates.


Later, you can run a tool that scans your manually created resources and shows the equivalent in Cloudformation syntax. This way, you’ll know exactly the resources involved and the order in which they should be created. This will be explained further in this document.


## “YAML is too verbose”
They certainly lack the power of real programming languages. However, the anchors and aliases features are lesser known and helps reduce the boilerplate.


Consider the case you’re writing serverless functions like these:

```yaml
Fn:
  Type: AWS::Lambda::Function
  Properties:
    Code:
      ZipFile: |
        def handler(event, context):
          pass
    Handler: index.handler
    Runtime: python3.6
    Role: !Sub '${Role.Arn}'
```
You will probably find yourself repeating properties like Handler and Runtime often. To handle this, declare the following anchor with your defaults under the Metadata section:

Metadata:
```yaml
 FunctionDefaults: &FunctionDefaults
   Handler: index.handler
   Runtime: python3.6
```

Then, to have your functions reference these 2 properties as defaults, write your function as follows:
```yaml
Fn:
   Type: AWS::Lambda::Function
   Properties:
     Code:
       ZipFile: |
         def handler(event, context):
           pass
     <<: *FunctionDefaults
     Role: !Sub '${Role.Arn}'
```

You need to expand these yaml anchors before deploying the stacks because CloudFormation doesn’t support yaml anchors. You can install a CLI tool like ruamel to preprocess your templates:

```bash
pip install ruamel.yaml.cmd
```

To use it, invoke it as such:

```bash
yaml merge-expand your-template.yaml your-template-expanded.yaml
```

This will put your function back in the format that the CloudFormation service is expected.

A different way to expand the anchors is to use the `aws clouformation package` command. See this blog post for a walkthrough:

https://stories.schubergphilis.com/cloudformation-coding-using-yaml-9127025813bb


This method works but it’s also a matter of personal taste. 2 other solutions to consider:

1. Use [Troposphere](tools.md#Troposphere), the template generator for Python
2. Use [Macros](key-features.md#Macros), the feature that allows runtime transformations of these templates

Read on to learn more about these 2 options.
