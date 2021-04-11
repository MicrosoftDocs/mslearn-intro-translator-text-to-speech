import { useEffect, useState } from "react";

export const TranslationResults = ({ results }) => {
  const [textToDisplay, setTextToDisplay] = useState([]);
  useEffect(() => {
    const playAndDisplayAudio = async () => {
      for (let index = 0; index < results.length; index++) {
        const translation = results[index];
        var audio = new Audio(translation.ttsAudioUrl);
        audio.type = "audio/wav";
        audio.play();
        setTextToDisplay([...textToDisplay, translation.translatedText]);
      }
    };
    if (results && results.length > 0) {
      playAndDisplayAudio();
    }
  }, [results, textToDisplay]);
  return (
    <>
      {textToDisplay.map((text) => (
        <p>{text}</p>
      ))}
    </>
  );
};
