import React, { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // 🔹 Import i18n
import { getInstructions, deleteInstruction } from "../../api/instructionApi";
import PaginationComponent from "../../compenents/PaginationComponent";

const InstructionListPage = ({ darkMode = false }) => {
  const { t } = useTranslation(); // 🔹 Hook i18n
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getInstructions();
      setInstructions(data || []);
    } catch (err) {
      toast.error(t("instructionPage.messages.loadError") + ": " + (err.message || "Inconnue"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("instructionPage.messages.confirmDelete"))) return;
    try {
      setDeletingId(id);
      await deleteInstruction(id);
      toast.success(t("instructionPage.messages.deleted"));
      setInstructions((prev) => prev.filter((i) => i.id_instruction !== id));
    } catch (err) {
      toast.error(t("instructionPage.messages.deleteError") + ": " + (err.message || "Inconnue"));
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const paginatedInstructions = instructions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className={`p-4 ${darkMode ? "bg-dark text-light" : "bg-light"}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>{t("instructionPage.title")}</h3>
        <Button variant="outline-primary" size="sm" onClick={fetchData}>
          🔄 {t("instructionPage.refresh")}
        </Button>
      </div>

      {instructions.length === 0 ? (
        <p>{t("instructionPage.noData")}</p>
      ) : (
        <>
          <Table striped bordered hover responsive className={darkMode ? "table-dark" : ""}>
            <thead>
              <tr>
                <th>{t("instructionPage.table.id")}</th>
                <th>{t("instructionPage.table.label")}</th>
                <th>{t("instructionPage.table.description")}</th>
                <th>{t("instructionPage.table.createdBy")}</th>
                <th>{t("instructionPage.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInstructions.map((inst, index) => (
                <tr key={inst.id_instruction}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{inst.libelle_instruction}</td>
                  <td>{inst.description || "-"}</td>
                  <td>{inst.user?.username || "N/A"}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(inst.id_instruction)}
                      disabled={deletingId === inst.id_instruction}
                    >
                      {deletingId === inst.id_instruction ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        t("instructionPage.buttons.delete")
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* 🔹 Pagination reusable */}
          <PaginationComponent
            totalItems={instructions.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default InstructionListPage;
