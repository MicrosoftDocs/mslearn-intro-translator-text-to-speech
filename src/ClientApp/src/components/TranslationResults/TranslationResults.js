import Typist from "react-typist";
import { useEffect } from "react";

// local imports
import { STATUS } from "../../constants";
import { wait } from "../../utility";
import { PlayAudio } from "./PlayAudio";

export const TranslationResults = ({ results, processingStatus }) => {
  const hasResults =
    processingStatus === STATUS.success && results && results.length > 0;
  useEffect(() => {
    const playAudio = async (results) => {
      console.log("started");
      for (let index = 0; index < results.length; index++) {
        const translation = results[index];
        await translation.audioElement.play();
        await wait(translation.duration * 1000);
      }
      console.log("finished");
    };
    if (hasResults) {
      playAudio(results);
    }
  }, [results, hasResults]);
  return hasResults ? (
    <>
      <Typist
        cursor={{
          show: false,
        }}
      >
        {results.map((translation) => {
          return (
            <p key={translation.translatedText}>
              {translation.translatedText}
              <Typist.Delay ms={translation.duration * 1000} />
            </p>
          );
        })}
      </Typist>
    </>
  ) : null;
};
