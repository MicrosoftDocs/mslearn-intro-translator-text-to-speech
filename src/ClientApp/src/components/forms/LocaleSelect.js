import React from "react";
import { Field } from "react-final-form";
import className from "classnames";
import Select from "react-select";

export const LocaleSelect = ({
  name,
  label,
  placeholder,
  errorMessage,
  locales,
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
              isMulti={true}
              value={input.value}
              placeholder={placeholder}
              disabled={disabled}
              onChange={(selectedLocale) => {
                input.onChange(selectedLocale);
              }}
              options={locales.map((l) => ({
                value: l.locale,
                label: l.displayName,
              }))}
              className={className({
                "locale-select": true,
                "is-invalid": error && touched,
              })}
              classNamePrefix="locale-select"
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
