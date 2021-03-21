import React from "react";
import { Form } from "react-final-form";
import { validate } from "./validate";
import { LanguageSelect, TextInput } from "./components";
import { supportedLanguages, presetTextValues } from "./data";

const convertSpeechToText = async (sourceLanguage, targetLanguage, text) => {
  const response = await fetch("speech/synthesizer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceLanguage,
      targetLanguage,
      text,
    }),
  });
  return await response.text();
};

export const App = () => {
  const initialValues = {
    sourceLanguage: "",
    targetLanguage: "",
    text: "",
  };
  const onSubmit = async (values) => {
    const response = await convertSpeechToText(
      values.sourceLanguage,
      values.targetLanguage,
      values.text
    );
    console.log(response);
  };
  const onPresetTextSelect = async (sourceLanguage, targetLanguage, text) => {
    const response = await convertSpeechToText(
      sourceLanguage,
      targetLanguage,
      text
    );
    console.log(response);
  };
  return (
    <>
      <nav className="container navbar navbar-light">
        <span className="navbar-brand ">Text to speech</span>
      </nav>
      <main className="container">
        <Form
          onSubmit={onSubmit}
          initialValues={initialValues}
          validate={validate}
          render={({ handleSubmit, values, submitting }) => (
            <>
              <form aria-label="Text to Speech" onSubmit={handleSubmit}>
                <LanguageSelect
                  name="sourceLanguage"
                  label="Source language"
                  placeholder="Select source language"
                  errorMessage="Please select a source language."
                  languages={supportedLanguages}
                  disabled={submitting}
                />
                <LanguageSelect
                  name="targetLanguage"
                  label="Target language"
                  placeholder="Select target language"
                  errorMessage="Please select a target language."
                  languages={supportedLanguages}
                  disabled={submitting}
                />
                <TextInput
                  name="text"
                  label="Text"
                  errorMessage="Please enter some text"
                  disabled={submitting}
                />
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </form>
              {values.sourceLanguage && values.targetLanguage
                ? presetTextValues[values.sourceLanguage].map((text) => (
                    <span
                      onClick={() =>
                        onPresetTextSelect(
                          values.sourceLanguage,
                          values.targetLanguage,
                          text
                        )
                      }
                      key={text}
                      class="badge badge-pill badge-secondary"
                    >
                      {text}
                    </span>
                  ))
                : null}
            </>
          )}
        />
      </main>
    </>
  );
};

export default App;
