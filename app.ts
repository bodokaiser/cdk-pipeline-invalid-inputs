import 'source-map-support/register'
import { App } from '@aws-cdk/core'
import { Construct, Stack, StackProps, Stage, StageProps } from '@aws-cdk/core'
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines'
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda'

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const connection = CodePipelineSource.connection('bodokaiser/cdk-pipeline-invalid-inputs', 'master', {
      connectionArn: 'arn:aws:codestar-connections:eu-central-1:873049347717:connection/5b68eecd-4f05-413f-9256-7781835efea5',
    })

    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth: new ShellStep('Synth', {
        input: connection,
        commands: [
          'yarn install --frozen-lockfile', 'yarn run build', 'npx cdk synth'
        ],
        additionalInputs: {
          some_additional_input: connection,
        }
      })
    })
    pipeline.addStage(new Application(this, 'Application'))
  }
}

class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    new Function(this, 'Function', {
      runtime: Runtime.NODEJS,
      handler: 'index.handler',
      code: Code.fromInline(`console.log("hello world")`),
    })
  }
}

class Application extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new LambdaStack(this, 'Lambda')
  }
}

const app = new App()

new PipelineStack(app, 'PipelineStack')

app.synth()
