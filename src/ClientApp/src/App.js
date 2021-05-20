import React, { useEffect, useState } from "react";
import className from "classnames";

// local imports
import "./App.css";
import {
  LanguageSettingsEditor,
  TextAreaField,
  TranslationResults,
  LanguageSettingButton,
  AddLanguageSettingButton,
  Loader,
} from "./components";
import { presetPhrases, presetLanguageSettings, STATUS } from "./constants";
import { synthesizeText, getLocales } from "./api";
import { removeAtIndex, getAdjustmentRangeValue } from "./utility";

export const App = () => {
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(undefined);
  const [languageSettings, setLanguageSettings] = useState(
    presetLanguageSettings
  );
  const [textToTranslate, setTextToTranslate] = useState();
  const [validationError, setValidationError] = useState();
  const [availableLocales, setAvailableLocales] = useState([]);
  const [processingStatus, setProcessingStatus] = useState(STATUS.idle);
  const [translationResults, setTranslationResults] = useState([]);

  const submitting = processingStatus === STATUS.pending;
  const showLanguageSettings =
    selectedLanguageIndex !== undefined &&
    languageSettings.length > 0 &&
    languageSettings[selectedLanguageIndex];

  const processTextToSpeech = async (text) => {
    try {
      if (!text) {
        setValidationError(
          "You must enter text or select a pre-made phrase below"
        );
        return;
      } else {
        setValidationError(undefined);
      }
      setProcessingStatus(STATUS.pending);
      setTranslationResults([]);
      const response = await synthesizeText(
        text,
        languageSettings.map((setting) => ({
          targetLanguage: setting.locale.language,
          voiceName: setting.voice.voiceShortName,
          adjustments: {
            pitch: getAdjustmentRangeValue(
              "pitch",
              setting.voice.adjustments.pitch
            ),
            rate: getAdjustmentRangeValue(
              "rate",
              setting.voice.adjustments.rate
            ),
            style: setting.voice.adjustments.style?.value,
          },
        }))
      );
      setTranslationResults(response);
      setProcessingStatus(STATUS.success);
    } catch (error) {
      setProcessingStatus(STATUS.failure);
    }
  };

  /**
   * Get and set available locales on first render
   */
  useEffect(() => {
    const getAndSetAvailableLocales = async () => {
      const response = await getLocales();
      setAvailableLocales(response);
    };
    getAndSetAvailableLocales();
  }, []);

  if (!availableLocales || availableLocales.length === 0) {
    return <Loader />;
  }
  return (
    <>
      <main className="container">
        <header className="PageHeader row">
          <div className="col-6">
            <h1 className="PageHeader__heading">
              Translator &amp; Text to Speech
            </h1>
            <p className="PageHeader__text">
              Write an announcement or select a pre-made announcement, and
              select the languages to translate your messages into. Translator
              service will translate your message into new languages, and
              text-to-speech will read out your message in the selected
              languages.
            </p>
          </div>
        </header>
        <div className="row py-3">
          <div className="col-6">
            <>
              <form
                aria-label="Text to Speech"
                onSubmit={(e) => {
                  e.preventDefault();
                  processTextToSpeech(textToTranslate);
                }}
                autoComplete="false"
              >
                <TextAreaField
                  name="text"
                  placeholder="Type something to translate..."
                  errorMessage={validationError}
                  value={textToTranslate}
                  onChange={(value) => setTextToTranslate(value)}
                  isMultiline
                  disabled={submitting}
                  className="TranslatorTextInput"
                />
                <div className="row py-3">
                  <div className="col">
                    <h4>Selected languages</h4>
                    <div className="row">
                      <div className="col  d-flex flex-wrap">
                        {languageSettings.map(({ locale }, index) => (
                          <LanguageSettingButton
                            key={index}
                            isSelected={index === selectedLanguageIndex}
                            locale={locale}
                            disabled={submitting}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedLanguageIndex(index);
                            }}
                            deleteSetting={() => {
                              debugger;
                              const updatedLanguageSettings = removeAtIndex(
                                languageSettings,
                                index
                              );
                              setSelectedLanguageIndex(
                                updatedLanguageSettings.length <= 1
                                  ? 0
                                  : updatedLanguageSettings.length - 1
                              );
                              setLanguageSettings(updatedLanguageSettings);
                            }}
                          />
                        ))}
                        <AddLanguageSettingButton
                          onClick={(e) => {
                            e.preventDefault();
                            const languages = [
                              ...languageSettings,
                              {
                                locale: {
                                  ...availableLocales[0],
                                  value: availableLocales[0].locale,
                                  label: availableLocales[0].displayName,
                                },
                                voice: undefined,
                              },
                            ];
                            setLanguageSettings(languages);
                            setSelectedLanguageIndex(languages.length - 1);
                          }}
                          disabled={submitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    {showLanguageSettings ? (
                      <LanguageSettingsEditor
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
                    ) : (
                      <p>
                        Click on a language to edit voice settings, or click{" "}
                        <strong>+ Add new language</strong> to create a new one.
                      </p>
                    )}
                  </div>
                </div>
                <div className="row py-3">
                  <div className="col">
                    <h4>Pre made phrases</h4>
                    <div className="d-flex flex-wrap flex-row">
                      {presetPhrases.map((text) => (
                        <button
                          key={text}
                          onClick={(e) => {
                            e.preventDefault();
                            processTextToSpeech(text);
                          }}
                          className={className({
                            btn: true,
                            flex: true,
                            "btn-phrase": true,
                          })}
                          disabled={submitting}
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-primary btn-wide float-right"
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
          <div className="col-6">
            <TranslationResults
              results={translationResults}
              processingStatus={processingStatus}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
