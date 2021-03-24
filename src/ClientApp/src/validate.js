export const validate = (values) => {
  const errors = {};
  if (!values.sourceLanguage) {
    errors.sourceLanguage = "Please select a source language.";
  }

  if (!values.targetLanguage) {
    errors.targetLanguage = "Please select a target language.";
  }

  if (!values.text) {
    errors.textInput = "Please enter some text input.";
  }
  return errors;
};
