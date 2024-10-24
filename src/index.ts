  import {uploadFiles} from './services/s3Services';
  import {transcriptionJob} from './services/transcribe';
  import {translateJob} from './services/translate';
  import {detectTechnicalCues} from './services/rekognition';
  import * as readline from 'readline';

  // const videoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${videoFileName}`;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Function to ask and collect user data
  const askQuestion = (question: string): Promise<string> => {
    return new Promise(resolve => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  };

  const main = async () => {
    try {
      const uploadFile = await askQuestion('Do you want to upload a file to your S3 bucket? (yes/no): ');
      // Upload file to s3 bucket  
      if (uploadFile.toLowerCase() === 'yes') {
        const fileName = await askQuestion('Enter the name with which you want to save the file in S3: ');
        const inputPath = await askQuestion('Enter the path of the file you want to upload: ');
        await uploadFiles(fileName, inputPath)
      }

      const transcriptVideo = await askQuestion('Do you want to transcribe the subtitles? (yes/no): ');
      // Start the transcription job
      if (transcriptVideo.toLowerCase() === 'yes') {
        const fileNameTranscription = await askQuestion('Enter the name of the file to transcribe to S3:');
        const outputTranscriptionPath = await askQuestion('Enter the path of the folder where the subtitles will be saved:');
        await transcriptionJob(fileNameTranscription, outputTranscriptionPath)
      }

      const translateSubtitle = await askQuestion('Do you want to translate the subtitles? (yes/no): ');
      // Start the translate job
      if (translateSubtitle.toLowerCase() === 'yes') {
        const inputTranslationPath = await askQuestion('Enter the path of the subtitle file to translate: ');
        const outputTranslationPath = await askQuestion('Enter the path where the translated subtitles will be saved: ');
        await translateJob(inputTranslationPath, outputTranslationPath)
      }

      const detectFaces = await askQuestion('Do you want to detect segments in your video? (yes/no): ');
      // Start the rekognition job
      if (detectFaces.toLowerCase() === 'yes') {
        const fileNameRekognition = await askQuestion('Enter the name of the video: ');
        const outputPathRekognition = await askQuestion('Enter the path where the detected segments will be saved: ');
        await detectTechnicalCues(fileNameRekognition,outputPathRekognition)
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      rl.close();
    }
  };

  main();
