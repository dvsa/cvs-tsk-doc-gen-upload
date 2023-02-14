import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

export const invokePdfGenLambda = async (docGenPayload, documentType: string, lambdaClient?: LambdaClient) => {
  const client = lambdaClient ?? new LambdaClient({ region: 'eu-west-1' });
  const payload: any = JSON.stringify({
    httpMethod: 'POST',
    pathParameters: {
      documentName: documentType,
      documentDirectory: 'CVS',
    },
    json: true,
    body: JSON.stringify(docGenPayload),
  });
  const command = new InvokeCommand({
    FunctionName: process.env.DOC_GEN_NAME,
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Payload: payload,
  });

  const response = await client.send(command);
  return response;
};
