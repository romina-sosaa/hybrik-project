import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
import fs from "fs";

export const translateJob = async (inputPath: string, outputPath:string, targetLanguage: string) => {

  const translateClient = new TranslateClient();

  // Read the VTT file
  const vttContent = fs.readFileSync(inputPath, "utf-8");

  const params = { 
    Text: vttContent,
    SourceLanguageCode: "en",
    TargetLanguageCode: targetLanguage,
  };

  try {
    // Start the translate job
    const startComand = new TranslateTextCommand(params)
    const translateResponse = await translateClient.send(startComand);

    // Get the translated text
    const translatedText = translateResponse.TranslatedText;
    const outputFilePath = `${outputPath}_translated.vtt`;

    if (typeof translatedText !== 'string') {
        throw new Error("Error: The translate is not valid.");
      }

    fs.writeFileSync(outputFilePath, translatedText, "utf-8");
    console.log("The translate job was succeed");

  } catch (error) {
    console.error("Error al traducir:", error);
  }
};
