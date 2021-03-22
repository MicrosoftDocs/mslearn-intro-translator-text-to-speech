import React from "react";
import { Field } from "react-final-form";
import className from "classnames";

export const LanguageSelect = ({
  name,
  label,
  placeholder,
  errorMessage,
  languages,
  disabled,
}) => {
  return (
    <Field id={name} name={name}>
      {({ input, meta: { error, touched } }) => (
        <div className="form-group">
          <label htmlFor={name}>{label}</label>
          <select
            id={name}
            defaultValue=""
            disabled={disabled}
            className={className({
              "custom-select": true,
              "is-invalid": error && touched,
            })}
            onChange={(event) => {
              input.onChange(event.target.value);
            }}
          >
            <option value="">{placeholder}</option>
            {languages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{errorMessage}</div>
        </div>
      )}
    </Field>
  );
};
