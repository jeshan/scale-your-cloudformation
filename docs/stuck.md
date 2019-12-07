# What to do when you feel stuck
Cloudformation is a great tool to manage your infra but it is challenging to learn at times. Here are a few things you can try if you’re feeling that you are not progressing quickly enough with it:
## 1. Use the management console
The management console is a great learning tool as it’s more visual than the API or the SDKs code. There are walkthroughs available which help you find the correct steps in which to create resources. Since you will need to recreate the resources under Cloudformation, you can use one of the template generators described in the next section. These will show you exactly what you would write as Cloudformation YAML syntax.

## 2. Check documented template snippets
AWS provides many examples for different services.
[Link](successful.md#aws-template-snippets)

## 3. Check the corresponding Create* Api
The HTTP API docs cover more documentation than the CloudFormation ones. Since CloudFormation calls these APIs on your behalf, you should sometimes be aware of the nitty-gritty when you don’t understand when things go wrong. Example: [Create a VPC Flow log](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateFlowLogs.html)

## 4. Ask AWS support about it
I have great experience asking for help from AWS. They are well-trained, know what they’re talking about and offer very helpful advice. The $100 / month is worth much more than the frustrations you’ll have to solve by yourself.
