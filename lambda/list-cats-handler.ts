import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({});

export const handler = async () => {
  try {
    const bucket = process.env.CATS_BUCKET!;
    
    const list = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
      })
    );

    const files = list.Contents || [];

    const urls = await Promise.all(
      files.map(async file => {
        const url = await getSignedUrl(
          client,
          new GetObjectCommand({
            Bucket: bucket,
            Key: file.Key,
          }),
          { expiresIn: 3600 }
        );

        return {
          fileName: file.Key,
          url
        };
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify(urls),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
