import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const current = i18n.language?.startsWith("ar") ? "ar" : "fr";
  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="outline-secondary"
        size="sm"
        className="d-flex align-items-center"
      >
        🌐 {current === "ar" ? "العربية" : "Français"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => changeLanguage("fr")}>
          Français
        </Dropdown.Item>
        <Dropdown.Item onClick={() => changeLanguage("ar")}>
          العربية
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
