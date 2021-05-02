import React, { useEffect, useState } from "react";

// local imports
import { SelectField, RangeField } from "../formControls";
import { getVoicesForLocale } from "../../api";
import { adjustments } from "../../constants";
import { getItemByProperty } from "../../utility";

const voiceHasAdjustment = (
  adjustmentName,
  voiceShortName,
  availableVoices
) => {
  const voice = getItemByProperty(
    "voiceShortName",
    voiceShortName,
    availableVoices
  );
  if (!voice) {
    return false;
  }
  switch (adjustmentName) {
    case adjustments.pitch.name:
    case adjustments.rate.name: {
      const adjustmentOptions = voice[`${adjustmentName}Options`];
      return !!adjustmentOptions;
    }
    case adjustments.style.name: {
      return voice.styles && voice.styles.length > 0;
    }
    default:
      return false;
  }
};

export const LanguageSettingsEditor = ({
  updateCurrentLanguageSetting,
  currentLanguageSetting,
  availableLocales,
  submitting,
}) => {
  const [availableVoices, setAvailableVoices] = useState([]);

  /**
   * Get and set locales based on the current selected language provided
   */
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
      if (!currentLanguageSetting.voice) {
        const updatedSetting = {
          ...currentLanguageSetting,
          voice: updatedVoices[0],
        };
        updateCurrentLanguageSetting(updatedSetting);
        return;
      }
      setAvailableVoices(updatedVoices);
    };
    getVoicesForSelectedLocale();
  }, [currentLanguageSetting, updateCurrentLanguageSetting]);

  const updateAdjustment = (name, value) => {
    const updatedSetting = {
      ...currentLanguageSetting,
      adjustments: {
        ...currentLanguageSetting.adjustments,
        [name]: value,
      },
    };
    updateCurrentLanguageSetting(updatedSetting);
  };

  if (!availableVoices || availableVoices.length === 0) {
    return null;
  }

  const renderStyleDropdown = () => {
    const voice = getItemByProperty(
      "voiceShortName",
      currentLanguageSetting.voice.voiceShortName,
      availableVoices
    );
    const adjustmentOptions = voice.styles;
    return (
      <SelectField
        name={adjustments.style.name}
        value={
          adjustmentOptions[currentLanguageSetting.adjustments.style].styleName
        }
        options={adjustmentOptions.map((v) => ({
          ...v,
          value: v.styleName,
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
    );
  };
  console.log(currentLanguageSetting);
  return (
    <div className="row">
      <div className="col-4">
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
      <div className="col-4">
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
      <div className="col-4">
        {voiceHasAdjustment(
          adjustments.pitch.name,
          currentLanguageSetting.voice.voiceShortName,
          availableVoices
        ) ? (
          <RangeField
            name={adjustments.pitch.name}
            label={adjustments.pitch.displayName}
            onChange={(value) =>
              updateAdjustment(adjustments.pitch.name, value)
            }
            value={currentLanguageSetting.adjustments.pitch}
            min={0}
            max={5}
          />
        ) : null}
        {voiceHasAdjustment(
          adjustments.rate.name,
          currentLanguageSetting.voice.voiceShortName,
          availableVoices
        ) ? (
          <RangeField
            name={adjustments.rate.name}
            label={adjustments.rate.displayName}
            onChange={(value) => updateAdjustment(adjustments.rate.name, value)}
            value={currentLanguageSetting.adjustments.rate}
            min={0}
            max={5}
          />
        ) : null}
        {voiceHasAdjustment(
          adjustments.style.name,
          currentLanguageSetting.voice.voiceShortName,
          availableVoices
        )
          ? renderStyleDropdown()
          : null}
      </div>
    </div>
  );
};
