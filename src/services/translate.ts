import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
import fs from 'fs';

export const translateJob = async (vttOutput: string, targetLanguage: string, translatedOutput: string) => {

  const translateClient = new TranslateClient({region: 'us-east-2'});
  let subtitles = '';

  try {
  const data = fs.readFileSync(vttOutput, "utf-8");
  subtitles = data;
  } catch (err) {
    console.error(err);
  }

  const params = { 
    Text: subtitles,
    SourceLanguageCode: "en",
    TargetLanguageCode: targetLanguage,
  };

  try {
    // Start the translate job
    const startComand = new TranslateTextCommand(params)
    const translateResponse = await translateClient.send(startComand);

    // Get the translated text
    const translatedText = translateResponse.TranslatedText;

    if (typeof translatedText !== 'string') {
        throw new Error("Error: The translate is not valid.");
      }

    fs.writeFileSync(translatedOutput, translatedText);
    console.log("The translate job was succeed");

  } catch (error) {
    console.error("Error al traducir:", error);
  }
};
