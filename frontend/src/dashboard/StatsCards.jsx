import React from "react";
import { Card } from "react-bootstrap";
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

const StatsCards = ({ stats, darkMode }) => {
  const { t } = useTranslation(); // Hook pour récupérer les traductions

  const statKeys = [
    { key: "totalDossiers", label: t("dashboard.statistiques.totalDossiers"), icon: <FileText size={40} />, color: "#007bff" },
    { key: "dossiersEnCours", label: t("dashboard.statistiques.enCours"), icon: <Clock size={40} />, color: "#ffc107" },
    { key: "dossiersTraites", label: t("dashboard.statistiques.termines"), icon: <CheckCircle size={40} />, color: "#28a745" },
    { key: "dossiersEnRetard", label: t("dashboard.statistiques.enRetard"), icon: <AlertTriangle size={40} />, color: "#dc3545" }
  ];

  return (
    <div className="row mb-4">
      {statKeys.map(({ key, label, icon, color }) => (
        <div key={key} className="col-lg-3 col-md-6 mb-3">
          <Card
            className="h-100 shadow"
            style={{
              backgroundColor: darkMode ? "#2c2c2c" : "#fff",
              border: darkMode ? "1px solid #444" : "1px solid #dee2e6"
            }}
          >
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-uppercase" style={{ color: darkMode ? "#aaa" : "#6c757d" }}>
                  {label}
                </h6>
                <h3 style={{ color: darkMode ? "#fff" : "#000" }}>
                  {stats[key] || 0}
                </h3>
              </div>
              <div style={{ color }}>{icon}</div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
