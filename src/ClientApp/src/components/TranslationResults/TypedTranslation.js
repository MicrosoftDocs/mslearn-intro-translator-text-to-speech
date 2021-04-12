import ReactTypingEffect from "react-typing-effect";
export const TypedTranslation = ({ translation }) => {
  console.log(translation);
  return (
    <ReactTypingEffect
      text={[translation.translatedText]}
      typingDelay={translation.delayBeforePlaying}
    ></ReactTypingEffect>
  );
};
