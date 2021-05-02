import className from "classnames";
import closeIcon from "./closeIcon.svg";
import addIcon from "../../images/add.svg";
import "./LanguageSettingButton.css";

export const LanguageSettingButton = ({
  locale,
  disabled,
  isSelected,
  onClick,
  deleteSetting,
}) => {
  return (
    <button
      key={locale.locale}
      className={className({
        btn: true,
        flex: true,
        LanguageSettingButton: true,
        "btn-language": true,
        "btn-light": !isSelected,
        "btn-primary": isSelected,
      })}
      disabled={disabled}
      onClick={onClick}
    >
      <span
        role="button"
        aria-label="Remove language setting"
        className="LanguageSettingButton__close"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteSetting();
        }}
      >
        <img alt="Remove language setting" src={closeIcon}></img>
      </span>
      {locale.displayName}
    </button>
  );
};

export const AddLanguageSettingButton = ({ disabled, onClick }) => {
  return (
    <button
      className={className({
        AddLanguageSettingButton: true,
        btn: true,
        flex: true,
        "btn-language": true,
        "btn-primary": true,
      })}
      disabled={disabled}
      onClick={onClick}
    >
      <img
        className="AddLanguageSettingButton__icon"
        aria-hidden
        src={addIcon}
        alt="Add new language"
      />
      Add new language
    </button>
  );
};
