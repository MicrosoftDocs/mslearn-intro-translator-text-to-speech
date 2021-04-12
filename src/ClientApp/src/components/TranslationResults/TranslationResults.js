import { useEffect } from "react";
import Typist from "react-typist";

// local imports
import { STATUS } from "../../constants";
import { wait } from "../../utility";

export const TranslationResults = ({ results, processingStatus }) => {
  const hasResults =
    processingStatus === STATUS.success && results && results.length > 0;
  useEffect(() => {
    const playAudio = async (results) => {
      console.log("started");
      const typedText = [];
      for (let index = 0; index < results.length; index++) {
        const translation = results[index];
        await translation.audioElement.play();
        typedText.push(translation.translatedText);
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
          show: true,
          blink: true,
          element: "|",
          hideWhenDone: true,
        }}
      >
        {results.map((translation) => {
          return (
            <p>
              {translation.translatedText}
              <Typist.Delay ms={translation.duration * 1000} />
            </p>
          );
        })}
      </Typist>
    </>
  ) : null;
};
