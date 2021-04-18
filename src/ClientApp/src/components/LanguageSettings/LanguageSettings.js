import React, { useEffect, useState } from "react";

// local imports
import { SelectField } from "../formControls";
import { getVoicesForLocale } from "../../api";

export const LanguageSettings = ({
  updateCurrentLanguageSetting,
  currentLanguageSetting,
  availableLocales,
  submitting,
}) => {
  const [availableVoices, setAvailableVoices] = useState([]);
  useEffect(() => {
    const getVoicesForSelectedLocale = async () => {
      if (!currentLanguageSetting?.locale) {
        setAvailableVoices(undefined);
        return;
      }
      const voices = await getVoicesForLocale(
        currentLanguageSetting.locale.locale
      );
      const updatedVoices = voices.map((v) => ({
        ...v,
        value: v.voiceShortName,
        label: v.displayName,
      }));
      setAvailableVoices(updatedVoices);
    };
    getVoicesForSelectedLocale();
  }, [currentLanguageSetting]);
  return (
    <div className="row">
      <div className="col-6">
        <SelectField
          name="locale"
          placeholder="Select some target locales"
          errorMessage="Please select a target language."
          value={currentLanguageSetting.locale}
          options={availableLocales.map((v) => ({
            ...v,
            value: v.locale,
            label: v.displayName,
          }))}
          onChange={(option) => {
            if (currentLanguageSetting.locale.locale === option.value) {
              return;
            }
            const updatedSetting = {
              ...currentLanguageSetting,
              locale: option,
              voice: undefined,
            };
            updateCurrentLanguageSetting(updatedSetting);
          }}
          disabled={submitting}
        />
      </div>
      <div className="col-6">
        <SelectField
          name="voice"
          placeholder="Select a voice"
          errorMessage="Please select a voice."
          options={availableVoices.map((v) => ({
            ...v,
            value: v.voiceShortName,
            label: v.displayName,
          }))}
          disabled={submitting}
          value={currentLanguageSetting.voice}
          onChange={(option) => {
            if (
              currentLanguageSetting?.voice?.voiceShortName ===
              option.voiceShortName
            ) {
              return;
            }
            const updatedSetting = {
              ...currentLanguageSetting,
              voice: option,
            };
            updateCurrentLanguageSetting(updatedSetting);
          }}
        />
      </div>
    </div>
  );
};
