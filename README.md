# cdk-pipeline-invalid-inputs

Minimial example for invalid inputs bug.

## Setup

1. Setup your aws profile in `~/.aws/credentials`.
2. Setup a GitHub connection in the AWS management console.
3. Bootstrap the cdk-environment via:

```shell
env CDK_NEW_BOOTSTRAP=1 npx cdk bootstrap \
    --profile <profile> \
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
    aws://<aws account id>/eu-central-1
```

4. Deploy the Pipeline via `npx cdk deploy --profile <profile> PipelineStack`