import {
    PutObjectCommand,
    S3Client,
    S3ServiceException,
    GetObjectCommand,
    NoSuchKey,
  } from "@aws-sdk/client-s3";
  
import { readFile } from "fs/promises";
import { awsConfig } from "../awsConfig"; 

const { writeFile } = require("node:fs/promises");

const createS3Client = () => new S3Client({
    region: awsConfig.region,
    credentials: {
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
    },
});

export const uploadFiles = async (fileName: string, inputPath: string) => {
    const client = createS3Client();

    const command = new PutObjectCommand({
        Bucket: awsConfig.bucketName,
        Key: fileName,
        Body: await readFile(inputPath),
    });

    try {
        const response = await client.send(command);
        console.log("Upload successful:", response);
    } catch (error) {
        handleS3Error(error, "uploading", fileName);
    }
};

export const downloadFiles = async (params: { key: string, outputPath: string }) => {
    const { key, outputPath } = params;
    const client = new S3Client({});
    const path = outputPath + key
    try {
      const response = await client.send(
        new GetObjectCommand({
          Bucket: awsConfig.bucketName,
          Key: key,
        }),
      );
      if (response.Body) {
        // const content = await response.Body.transformToString();

        await writeFile(path, response.Body);
        // console.log("Retrieved content:", content);
      } else {
        console.error('No content found');
      }
    } catch (error) {
        handleS3Error(error, "getting", key);
    }
  };
  
const handleS3Error = (error: any, action: string, key: string) => {
    if (error instanceof S3ServiceException) {
        if (error.name === "EntityTooLarge") {
            console.error(
                `Error from S3 while ${action} object "${key}" from "${awsConfig.bucketName}". \
                The object was too large. For files larger than 5GB, use the S3 console \
                or the multipart upload API.`
            );
        } else {
            console.error(
                `Error from S3 while ${action} object "${key}" from "${awsConfig.bucketName}". \
                ${error.name}: ${error.message}`
            );
        }
    } else if (error instanceof NoSuchKey) {
        console.error(
            `Error from S3 while getting object "${key}" from "${awsConfig.bucketName}". No such key exists.`
        );
    } else {
        throw error;
    }
};


