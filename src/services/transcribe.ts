import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  StartTranscriptionJobCommandInput,
  GetTranscriptionJobCommand,
} from "@aws-sdk/client-transcribe";

import fs from "fs";

export const transcriptionJob = async (vttOutput: string, fileName: string, bucketName: string) => {
  const transcribeClient = new TranscribeClient({region: 'us-east-2'});
  const jobName = `${fileName}_transcription`;

  const params: StartTranscriptionJobCommandInput = {
    TranscriptionJobName: jobName,
    LanguageCode: "en-US",
    MediaFormat: "mp4",
    Media: {
      MediaFileUri: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
    },
    Subtitles: {
      Formats: ["srt", "vtt"],
    },
  };

  try {
    // Start the transcription job
    const startCommand = new StartTranscriptionJobCommand(params);
    await transcribeClient.send(startCommand);
    console.log('The transcription work began');

    // Get the transcription job status
    const command = new GetTranscriptionJobCommand({ TranscriptionJobName: jobName });
    let transcribeResponse = await transcribeClient.send(command);

    let jobStatus = transcribeResponse.TranscriptionJob?.TranscriptionJobStatus;

    // Wait until the transcription finishes
    while (jobStatus === "IN_PROGRESS") {
      await new Promise(resolve => setTimeout(resolve, 5000));
      transcribeResponse = await transcribeClient.send(command);
      jobStatus = transcribeResponse.TranscriptionJob?.TranscriptionJobStatus;
      console.log('status', jobStatus);
    }

    if (jobStatus === "FAILED") {
      throw new Error("Transcribe job failed.");
    }

    transcribeResponse = await transcribeClient.send(command);
    const subtitles = transcribeResponse.TranscriptionJob?.Subtitles?.SubtitleFileUris;

    let srtContent = '';
    let vttContent = '';

    if (subtitles) {
      // Save SRT subtitles
      if (subtitles.length > 0) {
        const srtUrl = subtitles[0];
        const srtResponse = await fetch(srtUrl);
        const x = await srtResponse.text();
        if (x) srtContent = x
        // fs.writeFileSync(vttOutput, srtContent);
      }

      // Save VTT subtitles
      if (subtitles.length > 1) {
        const vttUrl = subtitles[1];
        const vttResponse = await fetch(vttUrl);
        const x = await vttResponse.text();
        if (x) vttContent = x
        fs.writeFileSync(vttOutput, vttContent);
      }
    }
    
    console.log("The transcription job succeeded");

  } catch (err) {
    console.log("Error", err);
  }
};
