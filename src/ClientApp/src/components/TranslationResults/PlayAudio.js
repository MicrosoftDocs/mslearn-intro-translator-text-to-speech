import { useEffect, useState } from "react";

export const PlayAudio = ({ audio, delay }) => {
  const [hasPlayed, setHasPlayed] = useState(false);
  useEffect(() => {
    const playAudioWithDelay = async () => {
      setTimeout(() => {
        audio.play();
        setHasPlayed(true);
      }, delay);
    };
    if (!hasPlayed) {
      console.log("hasPlayed");
      playAudioWithDelay();
    } else {
      console.log("not hasPlayed");
    }
  }, [audio, delay, hasPlayed]);
  return <></>;
};
