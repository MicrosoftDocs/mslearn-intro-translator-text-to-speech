import React from "react";
import { Field } from "react-final-form";
import className from "classnames";

export const TextInput = ({ name, label, errorMessage, disabled }) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <Field name={name} type="text">
      {({ input, meta: { error, touched } }) => (
        <>
          <input
            {...input}
            id={name}
            disabled={disabled}
            type="text"
            className={className({
              "form-control": true,
              "is-invalid": error && touched,
            })}
          />
          {error && touched ? (
            <div className="invalid-feedback">{errorMessage}</div>
          ) : null}
        </>
      )}
    </Field>
  </div>
);
