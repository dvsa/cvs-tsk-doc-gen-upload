import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { uploadPdfToS3 } from '../../src/services/S3.service';
import logger from '../../src/observability/logger';

jest.mock('@aws-sdk/client-s3', () => ({
  S3: jest.fn(),
  PutObjectCommand: jest.fn(),
}));

jest.mock('../../src/observability/logger');

describe('uploadPdfToS3', () => {
  const mockSend = jest.fn();
  const mockS3Client = {
    send: mockSend,
  };

  const data = Buffer.from('test data');
  const metaData = { key: 'data' };
  const fileName = 'testFile';

  beforeEach(() => {
    jest.clearAllMocks();
    (S3 as jest.Mock).mockImplementation(() => mockS3Client);
  });

  it('should upload the PDF to S3 with correct parameters', async () => {
    const response = { VersionId: '1' };
    mockSend.mockResolvedValueOnce(response);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await uploadPdfToS3(data, metaData, fileName);

    expect(S3).toHaveBeenCalledWith({ region: 'eu-west-1' });
    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: process.env.BUCKET_NAME,
      Key: `${process.env.BRANCH}/${fileName}.pdf`,
      Body: data,
      Metadata: metaData,
    });
    expect(mockSend).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    expect(result).toEqual(response);
  });

  it('should use the provided S3 client if one is passed', async () => {
    const customS3Client = { send: jest.fn().mockResolvedValue({ VersionId: '1' }) };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await uploadPdfToS3(data, metaData, fileName, customS3Client as unknown as S3);

    expect(customS3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(result.VersionId).toBe('1');
  });

  it('should handle errors thrown by the S3 client', async () => {
    const errorMessage = 'failed to upload to S3';
    mockSend.mockRejectedValueOnce(new Error(errorMessage));

    await expect(uploadPdfToS3(data, metaData, fileName)).rejects.toThrow(errorMessage);
    expect(logger.error).toHaveBeenCalledWith(errorMessage);
  });
});
