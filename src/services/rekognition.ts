import { RekognitionClient, StartSegmentDetectionCommand, GetSegmentDetectionCommand, StartSegmentDetectionCommandInput } from "@aws-sdk/client-rekognition";
import fs from "fs";

export const rekognitionJob = async (fileName:string, bucketName: string, rekognitionOutput: string) => {
  const rekognitionClient = new RekognitionClient({region: 'us-east-2'});

  const params: StartSegmentDetectionCommandInput = {
    Video: {
      S3Object: {
        Bucket: bucketName,
        Name: fileName,
      },
    },
    SegmentTypes: ['TECHNICAL_CUE'],
  };

  try {
    // Start the detection command  
    const startCommand = new StartSegmentDetectionCommand(params);
    const response = await rekognitionClient.send(startCommand);
    const jobId = response.JobId;

    // Get the detection command
    const command = new GetSegmentDetectionCommand({JobId: jobId});
    let rekognitionResponse = await rekognitionClient.send(command);

    let jobStatus = rekognitionResponse.JobStatus
    
    // Wait until the detection finishes
    while (jobStatus === "IN_PROGRESS"){
      rekognitionResponse = await rekognitionClient.send(command);
      jobStatus = rekognitionResponse.JobStatus
      console.log('status', jobStatus)
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (jobStatus === "FAILED") {
      throw new Error("Segment detection job failed.");
    }

    fs.writeFileSync(rekognitionOutput, JSON.stringify(rekognitionResponse, null, 2));
    console.log("The rekognition job was succeed");
  } catch (error) {
    console.error("Error:", error);
  }
};

