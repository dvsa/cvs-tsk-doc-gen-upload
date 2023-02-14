import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import logger from '../observability/logger';

export const uploadPdfToS3 = async (
  data: Buffer | Uint8Array | Blob | string | Readable,
  metadata: Record<string, string>,
  fileName: string,
  s3?: S3,
): Promise<any> => {
  const s3Client = s3 ?? new S3({ region: 'eu-west-1' });
  return s3Client
    .send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `${process.env.BRANCH}/${fileName}.pdf`,
        Body: data,
        Metadata: metadata,
      }),
    )
    .catch((err) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      logger.error(err.message);
      throw new Error(err.message as string);
    });
};
