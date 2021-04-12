import { useEffect, useState } from "react";
import { STATUS } from "../../constants";
import { wait } from "../../utility";

export const TranslationResults = ({ results, processingStatus }) => {
  const [typedText, setTypedText] = useState([]);
  useEffect(() => {
    const processResults = async (results) => {
      const typedText = [];
      for (let index = 0; index < results.length; index++) {
        const translation = results[index];
        await translation.audioElement.play();
        typedText.push(translation.translatedText);
        setTypedText(typedText);
        await wait(translation.duration * 1000);
      }
    };
    if (results && results.length > 0 && processingStatus === STATUS.success) {
      processResults(results);
    }
  }, [results, processingStatus]);
  console.log(typedText);
  return processingStatus === STATUS.success ? (
    <>
      {typedText.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </>
  ) : null;
};
