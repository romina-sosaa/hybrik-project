import yargs from 'yargs';
import { transcriptionJob } from './services/transcribe';
import { translateJob } from './services/translate';
import { rekognitionJob } from './services/rekognition';
import { uploadFiles } from './services/s3Services';

interface Args {
  bucketName: string;
  filePath: string;
  fileName: string;
  transcriptionOutPath: string;
  vttFilePath: string;
  translationOutPath: string;
  targetLanguage: string;
  rekognitionOutPath: string;
}

const argv = yargs
  .option('bucketName', {
    description: 'S3 bucket name',
    type: 'string',
    demandOption: true,
  })
  .option('filePath', {
    description: 'File path',
    type: 'string',
    demandOption: true,
  })
  .option('fileName', {
    description: 'File name',
    type: 'string',
    demandOption: true,
  })
  .option('transcriptionOutPath', {
    description: 'Output path for transcription',
    type: 'string',
    demandOption: true,
  })
  .option('vttFilePath', {
    description: 'VTT file path',
    type: 'string',
    demandOption: true,
  })
  .option('translationOutPath', {
    description: 'Output route for translation',
    type: 'string',
    demandOption: true,
  })
  .option('targetLanguage', {
    description: 'Target language for translation',
    type: 'string',
    demandOption: true,
  })
  .option('rekognitionOutPath', {
    description: 'Output route for reconnaissance',
    type: 'string',
    demandOption: true,
  })
  .help()
  .alias('help', 'h')
  .argv as Args;

async function main() {
  try {
    await uploadFiles(argv.fileName, argv.filePath, argv.bucketName);
    console.log("Video upload complete.");

    await transcriptionJob(argv.fileName, argv.transcriptionOutPath, argv.bucketName);
    console.log("Transcription complete.");

    await translateJob(argv.vttFilePath, argv.translationOutPath, argv.targetLanguage);
    console.log("Translation complete.");

    await rekognitionJob(argv.fileName, argv.rekognitionOutPath, argv.bucketName);
    console.log("Technical cue detection complete.");
    
  } catch (error) {
    console.error("Error during processing:", error);
  }
}

main();
