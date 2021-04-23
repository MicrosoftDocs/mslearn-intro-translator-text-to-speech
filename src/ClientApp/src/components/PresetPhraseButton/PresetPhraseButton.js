import className from "classnames";
export const PresetPhraseButton = ({ text, disabled, processTextToSpeech }) => {
  debugger;
  return (
    <button
      key={text}
      onClick={() => processTextToSpeech(text)}
      className={className({
        btn: true,
        flex: true,
        "btn-phrase": true,
      })}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
