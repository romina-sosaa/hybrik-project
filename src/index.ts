import yargs from 'yargs';
import { transcriptionJob } from './services/transcribe';
import { translateJob } from './services/translate';
import { rekognitionJob } from './services/rekognition';

interface Args {
  bucketName: string;
  fileName: string;
  vttOutput: string;
  translatedOutput: string;
  targetLanguage: string;
  rekognitionOutput: string;
}

const argv = yargs
  .option('bucketName', {
    description: 'S3 bucket name',
    type: 'string',
    demandOption: true,
  })
  .option('fileName', {
    description: 'File name',
    type: 'string',
    demandOption: true,
  })
  .option('vttOutput', {
    description: 'Vtt output',
    type: 'string',
    demandOption: true,
  })
  .option('translatedOutput', {
    description: 'translated output',
    type: 'string',
    demandOption: true,
  })
  .option('targetLanguage', {
    description: 'Target language for translation',
    type: 'string',
    demandOption: true,
  })
  .option('rekognitionOutput', {
    description: 'rekognition output',
    type: 'string',
    demandOption: true,
  })
  .help()
  .alias('help', 'h')
  .argv as Args;

async function main() {
  try {

    await transcriptionJob(argv.vttOutput, argv.fileName, argv.bucketName);
    console.log("Transcription complete.");

    await translateJob(argv.vttOutput, argv.targetLanguage, argv.translatedOutput);
    console.log("Translation complete.");

    await rekognitionJob(argv.fileName, argv.bucketName, argv.rekognitionOutput);
    console.log("Technical cue detection complete.");
    
  } catch (error) {
    console.error("Error during processing:", error);
  }
}

main();
