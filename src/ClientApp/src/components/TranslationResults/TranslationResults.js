import { useEffect, useState } from "react";

export const TranslationResults = ({ results }) => {
  const [textToDisplay, setTextToDisplay] = useState("");
  useEffect(() => {
    const playAndDisplayAudio = async () => {
      for (let index = 0; index < results.length; index++) {
        const translation = results[index];
        var audio = new Audio(translation.ttsAudioUrl);
        audio.type = "audio/wav";
        setTimeout(() => {
          audio.play();
          setTextToDisplay(`${textToDisplay} \n ${translation.translatedText}`);
        }, 4000);
      }
    };
    if (results && results.length > 0) {
      debugger;
      playAndDisplayAudio();
    }
  }, [results]);
  return <>{textToDisplay}</>;
};
