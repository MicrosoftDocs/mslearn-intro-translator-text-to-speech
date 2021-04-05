import React, { useEffect, useState } from "react";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";

// local imports
import "./App.css";
import { validate } from "./validate";
import { LocaleSelect, TextInput, VoiceSelect } from "./components";
import { presetTextValues } from "./data";
import { synthesizeText, getLocales, getVoicesForLocale } from "./api";

export const App = () => {
  const [selectedLocale, setSelectedLocale] = useState();
  const [availableLocales, setAvailableLocales] = useState([]);
  const [availableVoices, setAvailableVoices] = useState([]);
  const initialValues = {
    locales: [],
    text: "",
  };
  const processTextToSpeech = async (targetLocales, voice, text) => {
    const response = await synthesizeText(
      targetLocales.map((l) => l.language),
      voice,
      text
    );
    var audio = new Audio(response);
    audio.play();
  };

  useEffect(() => {
    const getAndSetAvailableLocales = async () => {
      const response = await getLocales();
      setAvailableLocales(response);
      setSelectedLocale(response[0]);
    };
    getAndSetAvailableLocales();
  }, []);

  useEffect(() => {
    const getAndSetVoices = async () => {
      if (!selectedLocale) {
        setAvailableVoices(undefined);
        return;
      }
      const voices = await getVoicesForLocale(selectedLocale.locale);
      setAvailableVoices(voices);
    };
    getAndSetVoices();
  }, [selectedLocale]);

  if (!availableLocales || availableLocales.length === 0) {
    return null;
  }
  return (
    <>
      <nav className="container-fluid navbar navbar-light">
        <span className="navbar-brand ">Translator & Text to Speech</span>
      </nav>
      <main className="container-fluid">
        <header>
          <p>
            Write an announcement or select a pre-made announcement, and select
            the languages to translate your messages into. Translator service
            will translate your message into new languages, and text-to-speech
            will read out your message in the selected languages.
          </p>
        </header>
        <div className="row">
          <div className="col-6">
            <Form
              mutators={{
                ...arrayMutators,
              }}
              onSubmit={(values) => {
                processTextToSpeech(
                  values.locales,
                  values.voice.voiceShortName,
                  values.text
                );
              }}
              initialValues={initialValues}
              validate={validate}
              render={({ handleSubmit, values, submitting }) => (
                <>
                  <form aria-label="Text to Speech" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-6">
                        <LocaleSelect
                          name="locales"
                          label="Target locales"
                          placeholder="Select some target locales"
                          errorMessage="Please select a target language."
                          options={availableLocales.map((v) => ({
                            ...v,
                            value: v.locale,
                            label: v.displayName,
                          }))}
                          disabled={submitting}
                        />
                      </div>
                      <div className="col-6">
                        <VoiceSelect
                          name="voice"
                          label="Selected voice"
                          placeholder="Select a voice"
                          errorMessage="Please select a voice."
                          options={
                            availableVoices
                              ? availableVoices.map((v) => ({
                                  ...v,
                                  value: v.voiceShortName,
                                  label: v.displayName,
                                }))
                              : []
                          }
                          disabled={submitting}
                        />
                      </div>
                    </div>
                    <TextInput
                      name="text"
                      label="Text"
                      errorMessage="Please enter some text"
                      disabled={submitting}
                    />
                    {values.locales && values.locales.length > 0 ? (
                      <div className="row">
                        <div className="col">
                          {values.locales.map(({ value, label }) => (
                            <span
                              key={value}
                              className="badge badge-pill badge-secondary"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <div className="row">
                      <div className="col">
                        {presetTextValues.map((text) => (
                          <span
                            onClick={() =>
                              processTextToSpeech(
                                values.targetLanguage,
                                values.text
                              )
                            }
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
              )}
            />
          </div>
          <div className="col-6">Output</div>
        </div>
      </main>
    </>
  );
};

export default App;
