import { Construct, Stage, StageProps } from '@aws-cdk/core'
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda'

export class Application extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const fn = new Function(this, 'Function', {
      runtime: Runtime.NODEJS,
      handler: 'index.handler',
      code: Code.fromInline('console.log("hello world")'),
    })
  }
}