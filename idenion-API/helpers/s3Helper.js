const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.S3_Idenion_ACCESS_KEY,
    secretAccessKey: process.env.S3_Idenion_SECRET_KEY,
  },
});

const putObjectUrl = async (bucket, key, contentType) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 10 * 60 });
  return url;
};

const getObjectUrl = async (bucket, key, contentType) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
};

module.exports = {
  putObjectUrl,
  getObjectUrl,
};
