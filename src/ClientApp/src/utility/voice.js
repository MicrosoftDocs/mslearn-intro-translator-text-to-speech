export const getDefaultVoiceAdjustments = (voice) => {
  return {
    pitch: voice.pitchOptions ? 5 : undefined,
    rate: voice.rateOptions ? 100 : undefined,
    style:
      voice.styles && voice.styles.length > 0
        ? {
            ...voice.styles[0],
            label: voice.styles[0].displayName,
            value: voice.styles[0].styleName,
          }
        : undefined,
  };
};

export const getAdjustmentRangeValue = (adjustmentName, adjustmentValue) => {
  if (!adjustmentName || !adjustmentValue) {
    return undefined;
  }
  switch (adjustmentName) {
    case "rate":
      return adjustmentValue === 0 ? 0.1 : adjustmentValue * 0.01;
    case "pitch":
      if (adjustmentValue === 5) {
        return "default";
      }
      return adjustmentValue > 5
        ? `+${adjustmentValue - 5}`
        : `-${adjustmentValue}`;
    default: {
      return undefined;
    }
  }
};
