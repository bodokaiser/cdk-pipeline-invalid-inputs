import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines'

import { Application } from './application';

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