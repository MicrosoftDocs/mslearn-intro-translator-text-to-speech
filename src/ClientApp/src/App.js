import React, { useEffect, useState } from "react";
import className from "classnames";

// local imports
import "./App.css";
import { LanguageSettings, TextInput } from "./components";
import { presetPhrases, presetLanguageSettings, STATUS } from "./constants";
import { synthesizeText, getLocales } from "./api";

export const App = () => {
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0);
  const [languageSettings, setLanguageSettings] = useState(
    presetLanguageSettings
  );
  const [textToTranslate, setTextToTranslate] = useState();
  const [availableLocales, setAvailableLocales] = useState([]);
  const [processingStatus, setProcessingStatus] = useState(STATUS.idle);
  const submitting = processingStatus === STATUS.pending;

  const processTextToSpeech = async () => {
    try {
      setProcessingStatus(STATUS.pending);
      const response = await synthesizeText(
        textToTranslate,
        languageSettings.map((setting) => ({
          targetLanguage: setting.locale.language,
          voiceName: setting.voice.voiceShortName,
        }))
      );
      var audio = new Audio(response);
      audio.play();
      setProcessingStatus(STATUS.success);
    } catch {
      setProcessingStatus(STATUS.failure);
    }
  };

  useEffect(() => {
    const getAndSetAvailableLocales = async () => {
      const response = await getLocales();
      setAvailableLocales(response);
    };
    getAndSetAvailableLocales();
  }, []);

  if (!availableLocales || availableLocales.length === 0) {
    return null;
  }
  return (
    <>
      <main className="container">
        <header className="row">
          <div className="col-6">
            <h1>Translator &amp; Text to Speech</h1>
            <p>
              Write an announcement or select a pre-made announcement, and
              select the languages to translate your messages into. Translator
              service will translate your message into new languages, and
              text-to-speech will read out your message in the selected
              languages.
            </p>
          </div>
        </header>
        <div className="row py-4">
          <div className="col-6">
            <>
              <form
                aria-label="Text to Speech"
                onSubmit={(e) => {
                  e.preventDefault();
                  processTextToSpeech();
                }}
              >
                <LanguageSettings
                  availableLocales={availableLocales}
                  currentLanguageSetting={
                    languageSettings[selectedLanguageIndex]
                  }
                  updateCurrentLanguageSetting={(updatedValue) => {
                    const updatedSettings = [...languageSettings];
                    updatedSettings[selectedLanguageIndex] = updatedValue;
                    setLanguageSettings(updatedSettings);
                  }}
                  submitting={submitting}
                />
                <TextInput
                  name="text"
                  label="Text"
                  errorMessage="Please enter some text"
                  value={textToTranslate}
                  onChange={(value) => setTextToTranslate(value)}
                  isMultiline
                  submitting={submitting}
                />
                <div className="row py-4">
                  <div className="col">
                    <h4>Selected languages</h4>
                    {languageSettings.map((value, index) => {
                      return (
                        <button
                          className={className({
                            btn: true,
                            "btn-light": index !== selectedLanguageIndex,
                            "btn-primary": index === selectedLanguageIndex,
                          })}
                        >
                          {value.locale.displayName}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="row py-4">
                  <div className="col">
                    <h4>Pre made phrases</h4>
                    {presetPhrases.map((text) => (
                      <span
                        onClick={() => processTextToSpeech()}
                        key={text}
                        className="badge badge-pill badge-secondary"
                      >
                        {text}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={submitting}
                    >
                      Translate
                    </button>
                  </div>
                </div>
              </form>
            </>
          </div>
          <div className="col-6">Output</div>
        </div>
      </main>
    </>
  );
};

export default App;
