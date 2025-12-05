import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({});

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);

    const base64Image = body.imageBase64;
    const imageBuffer = Buffer.from(base64Image, "base64");

    const fileName = `cat-${Date.now()}.jpg`;

    await client.send(
      new PutObjectCommand({
        Bucket: process.env.CATS_BUCKET,
        Key: fileName,
        Body: imageBuffer,
        ContentType: "image/jpeg",
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
      body: JSON.stringify({
        message: "Cat uploaded successfully",
        fileName,
      }),
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
