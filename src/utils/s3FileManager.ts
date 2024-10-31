import {
    PutObjectCommand,
    S3Client,
    S3ServiceException,
    GetObjectCommand,
    NoSuchKey,
  } from "@aws-sdk/client-s3";

const { writeFile } = require("node:fs/promises");

export const uploadFiles = async (fileName: string, content: string, bucketName: string) => {
    const client = new S3Client({region: 'us-east-2'});

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: content,
    });

    try {
        const response = await client.send(command);
        console.log("Upload successful:");
    } catch (error) {
        handleS3Error(error, "uploading", fileName, bucketName);
    }
};

export const downloadFiles = async (key: string, outputPath: string, bucketName: string) => {
    const client = new S3Client({});
    const path = outputPath + key
    try {
      const response = await client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        }),
      );
      if (response.Body) {
        await writeFile(path, response.Body);
      } else {
        console.error('No content found');
      }
    } catch (error) {
        handleS3Error(error, "getting", key, bucketName);
    }
  };
  
const handleS3Error = (error: any, action: string, key: string, bucketName: string) => {
    if (error instanceof S3ServiceException) {
        if (error.name === "EntityTooLarge") {
            console.error(
                `Error from S3 while ${action} object "${key}" from "${bucketName}". \
                The object was too large. For files larger than 5GB, use the S3 console \
                or the multipart upload API.`
            );
        } else {
            console.error(
                `Error from S3 while ${action} object "${key}" from "${bucketName}". \
                ${error.name}: ${error.message}`
            );
        }
    } else if (error instanceof NoSuchKey) {
        console.error(
            `Error from S3 while getting object "${key}" from "${bucketName}". No such key exists.`
        );
    } else {
        throw error;
    }
};
