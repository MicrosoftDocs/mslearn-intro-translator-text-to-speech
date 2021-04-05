export const validate = (values) => {
  const errors = {};
  if (!values.locales || values.locales.length === 0) {
    errors.locales = "You need to select at lest one target language.";
  }

  if (!values.text) {
    errors.textInput = "Please enter some text input.";
  }
  return errors;
};
