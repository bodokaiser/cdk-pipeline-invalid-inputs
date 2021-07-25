import 'source-map-support/register'
import { App } from '@aws-cdk/core'
import { Construct, Stack, StackProps, Stage, StageProps } from '@aws-cdk/core'
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines'
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda'

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection('bodokaiser/cdk-pipeline-invalid-inputs', 'master', {
          connectionArn: 'arn:aws:codestar-connections:eu-central-1:873049347717:connection/5b68eecd-4f05-413f-9256-7781835efea5',
        }),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      })
    })
    pipeline.addStage(new Application(this, 'Application'))
  }
}

class Application extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const fn = new Function(this, 'Function', {
      runtime: Runtime.NODEJS,
      handler: 'index.handler',
      code: Code.fromInline('console.log("hello world")'),
    })
  }
}

const app = new App()

new PipelineStack(app, 'PipelineStack', {
  env: {
    account: '472296971567',
    region: 'eu-central-1',
  },
})

app.synth()
