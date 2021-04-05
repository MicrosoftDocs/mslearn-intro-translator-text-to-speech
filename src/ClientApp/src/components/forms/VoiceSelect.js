import React from "react";
import { Field } from "react-final-form";
import className from "classnames";
import Select from "react-select";

export const VoiceSelect = ({
  name,
  label,
  placeholder,
  errorMessage,
  options,
  disabled,
}) => {
  return (
    <Field id={name} name={name}>
      {({ input, meta: { error, touched } }) => {
        return (
          <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <Select
              name={name}
              value={input.value}
              placeholder={placeholder}
              disabled={disabled}
              onChange={(value) => {
                input.onChange(value);
              }}
              options={options}
              className={className({
                "voice-select": true,
                "is-invalid": error && touched,
              })}
              classNamePrefix="voice-select"
            />
            {error && touched ? (
              <div className="invalid-feedback">{errorMessage}</div>
            ) : null}
          </div>
        );
      }}
    </Field>
  );
};
