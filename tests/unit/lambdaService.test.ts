import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { invokePdfGenLambda } from '../../src/services/Lambda.service';

jest.mock('@aws-sdk/client-lambda', () => ({
  LambdaClient: jest.fn(),
  InvokeCommand: jest.fn(),
}));

describe('invokePdfGenLambda', () => {
  const mockSend = jest.fn();
  const mockLambdaClient = {
    send: mockSend,
  };

  const docGenPayload = { key: 'data' };
  const documentType = 'testDocument';

  beforeEach(() => {
    jest.clearAllMocks();
    (LambdaClient as jest.Mock).mockImplementation(() => mockLambdaClient);
  });

  it('should invoke the Lambda function with correct parameters', async () => {
    const response = { StatusCode: 200 };
    mockSend.mockResolvedValueOnce(response);

    const result = await invokePdfGenLambda(docGenPayload, documentType);

    expect(LambdaClient).toHaveBeenCalledWith({ region: 'eu-west-1' });
    expect(InvokeCommand).toHaveBeenCalledWith({
      FunctionName: process.env.DOC_GEN_NAME,
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify({
        httpMethod: 'POST',
        pathParameters: {
          documentName: documentType,
          documentDirectory: 'CVS',
        },
        json: true,
        body: JSON.stringify(docGenPayload),
      }),
    });
    expect(mockSend).toHaveBeenCalledWith(expect.any(InvokeCommand));
    expect(result).toEqual(response);
  });

  it('should use the given LambdaClient if one is present', async () => {
    const customClient = { send: jest.fn().mockResolvedValueOnce({ StatusCode: 200 }) };
    const result = await invokePdfGenLambda(docGenPayload, documentType, customClient as unknown as LambdaClient);

    expect(customClient.send).toHaveBeenCalledWith(expect.any(InvokeCommand));
    expect(result.StatusCode).toBe(200);
  });

  it('should handle errors thrown by the Lambda client', async () => {
    const errorMessage = 'Lambda invocation failed';
    mockSend.mockRejectedValueOnce(new Error(errorMessage));

    await expect(invokePdfGenLambda(docGenPayload, documentType)).rejects.toThrow(errorMessage);
  });
});
