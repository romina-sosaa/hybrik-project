import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
import fs from "fs";
import { awsConfig } from "../awsConfig"; 
import path from "path";

export const translateJob = async (inputPath: string, outputPath:string) => {

  const translateClient = new TranslateClient({
    region: awsConfig.region,
    credentials: {
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
    },
  });

  // Read the VTT file
  const vttContent = fs.readFileSync(inputPath, "utf-8");

  const params = { 
    Text: vttContent,
    SourceLanguageCode: "en",
    TargetLanguageCode: "es",
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
