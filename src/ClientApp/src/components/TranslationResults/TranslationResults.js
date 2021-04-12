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
        await wait(translation.duration * 1000);
      }
      setTypedText(typedText);
    };
    if (processingStatus === STATUS.success && results && results.length > 0) {
      processResults(results);
    }
  }, [results, processingStatus]);
  console.log(typedText);
  return processingStatus === STATUS.success ? (
    <>
      {typedText.map((text) => {
        console.log(text);
        return <p key={text}>{text}</p>;
      })}
    </>
  ) : null;
};
