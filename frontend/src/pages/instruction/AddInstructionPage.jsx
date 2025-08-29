import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getDossiers, addInstructionToDossier } from '../../api/dossierApi';
import { getInstructions } from '../../api/instructionApi';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Tabs, Tab } from "react-bootstrap";
import InstructionListPage from "./InstructionListPage";

// Composants séparés
import StatsCards from './StatsCards';
import DossierSelector from './DossierSelector';
import InstructionSelector from './InstructionSelector';
import SelectedInstructionsList from './SelectedInstructionsList';
import NewInstructionModal from './NewInstructionModal';

const AddInstructionPage = ({ darkMode = false }) => {
    const [tab, setTab] = useState("gestion");
  const [dossiers, setDossiers] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [filteredDossiers, setFilteredDossiers] = useState([]);
  const [filteredInstructions, setFilteredInstructions] = useState([]);
  const [dossierId, setDossierId] = useState('');
  const [selectedInstructions, setSelectedInstructions] = useState([]);
  const [currentInstructionId, setCurrentInstructionId] = useState('');
  const [dossierSearch, setDossierSearch] = useState('');
  const [instructionSearch, setInstructionSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Modal création instruction
  const [showNewInstructionModal, setShowNewInstructionModal] = useState(false);
  const [creatingInstruction, setCreatingInstruction] = useState(false);

  // Templates rapides
  const quickInstructionTemplates = [
    { name: "Dossier en cours", description: "Le dossier est actuellement en cours de traitement" },
    { name: "Dossier en attente", description: "Le dossier est en attente de documents complémentaires" },
    { name: "Dossier validé", description: "Le dossier a été validé par le service compétent" },
    { name: "Dossier rejeté", description: "Le dossier a été rejeté pour non-conformité" },
    { name: "Documents manquants", description: "Des documents sont manquants pour finaliser le dossier" },
    { name: "Révision nécessaire", description: "Le dossier nécessite une révision avant validation" },
    { name: "Approbation finale", description: "Le dossier attend l'approbation finale" },
    { name: "Archivage", description: "Le dossier peut être archivé" }
  ];
const selectedDossier = dossiers.find(d => d.num_dossier == dossierId);



  const themeClasses = {
    containerBg: darkMode ? 'bg-dark text-light' : 'bg-light',
    cardBg: darkMode ? 'bg-dark text-light border-secondary' : 'bg-white',
    inputClass: darkMode ? 'bg-dark text-light border-secondary' : '',
    selectClass: darkMode ? 'bg-dark text-light border-secondary' : '',
    listBg: darkMode ? 'bg-secondary' : 'bg-light',
    modalBg: darkMode ? 'bg-dark text-light' : 'bg-white'
  };

  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
  try {
    setLoading(true);
    const dossiersData = await getDossiers(); // => { total, dossiers }
    const instructionsData = await getInstructions();

    setDossiers(dossiersData.dossiers || []); // فقط المصفوفة
    setInstructions(instructionsData || []);
    setFilteredDossiers(dossiersData.dossiers || []);
    setFilteredInstructions(instructionsData || []);
  } catch (err) {
    toast.error('Erreur chargement: ' + (err.response?.data?.message || err.message));
    setDossiers([]);
    setInstructions([]);
  } finally {
    setLoading(false);
  }
};


  // Filter dossiers
  useEffect(() => {
    if (!dossierSearch.trim()) setFilteredDossiers(dossiers);
    else {
      setFilteredDossiers(
        dossiers.filter(d => 
          d.intitule_dossier?.toLowerCase().includes(dossierSearch.toLowerCase()) ||
          d.num_dossier.toString().includes(dossierSearch)
        )
      );
    }
  }, [dossierSearch, dossiers]);

  // Filter instructions
  useEffect(() => {
    let filtered = instructions.filter(i => 
      !selectedInstructions.some(si => si.id_instruction === i.id_instruction)
    );
    if (instructionSearch.trim()) {
      filtered = filtered.filter(i => 
        i.libelle_instruction?.toLowerCase().includes(instructionSearch.toLowerCase())
      );
    }
    setFilteredInstructions(filtered);
  }, [instructionSearch, instructions, selectedInstructions]);

  // Add instruction to list
  const handleAddInstruction = () => {
    if (!currentInstructionId) return toast.warning('Veuillez sélectionner une instruction');
    const instruction = instructions.find(i => i.id_instruction == currentInstructionId);
    if (instruction && !selectedInstructions.some(si => si.id_instruction === instruction.id_instruction)) {
      setSelectedInstructions(prev => [...prev, instruction]);
      setCurrentInstructionId('');
      setInstructionSearch('');
      toast.success(`Instruction "${instruction.libelle_instruction}" ajoutée à la liste`);
    }
  };

  // Remove instruction
  const handleRemoveInstruction = (instructionId) => {
    setSelectedInstructions(prev => prev.filter(si => si.id_instruction !== instructionId));
    toast.info('Instruction retirée de la liste');
  };

  // Clear all
  const handleClearAll = () => {
    setSelectedInstructions([]);
    setCurrentInstructionId('');
    setInstructionSearch('');
    toast.info('Liste d\'instructions effacée');
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dossierId || selectedInstructions.length === 0) {
      return toast.error('Veuillez choisir un dossier et au moins une instruction');
    }
    try {
      setSubmitLoading(true);
      let successCount = 0;
      let errorCount = 0;
      for (const instruction of selectedInstructions) {
        try {
          await addInstructionToDossier(Number(dossierId), Number(instruction.id_instruction));
          successCount++;
        } catch (err) {
          errorCount++;
          console.error(err);
        }
      }
      if (successCount > 0) toast.success(`${successCount} instruction(s) ajoutée(s) avec succès!`);
      if (errorCount > 0) toast.error(`${errorCount} instruction(s) ont échoué`);
      if (errorCount === 0) {
        setDossierId('');
        setSelectedInstructions([]);
        setCurrentInstructionId('');
        setDossierSearch('');
        setInstructionSearch('');
      }
    } catch (err) {
      toast.error('Erreur générale: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-vh-100 d-flex align-items-center justify-content-center ${themeClasses.containerBg}`}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" style={{ width: '3rem', height: '3rem' }} />
          <h5 className={darkMode ? 'text-light' : 'text-dark'}>Chargement des données...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-vh-100 py-5 ${themeClasses.containerBg}`}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            {/* Statistiques */}
            <StatsCards
              dossiers={dossiers}
              instructions={instructions}
              selectedInstructions={selectedInstructions}
              dossierId={dossierId}
              darkMode={darkMode}
            />

            <Row>
              <Col lg={7}>
                <DossierSelector
                  dossiers={dossiers}
                  filteredDossiers={filteredDossiers}
                  dossierId={dossierId}
                  setDossierId={setDossierId}
                  dossierSearch={dossierSearch}
                  setDossierSearch={setDossierSearch}
                  selectedDossier={selectedDossier}
                  themeClasses={themeClasses}
                  darkMode={darkMode}
                />

                {/* Bouton ouvrir modal */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold">Gestion des instructions</h5>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => setShowNewInstructionModal(true)}
                  >
                    + Nouvelle instruction
                  </Button>
                </div>

                <InstructionSelector
                  instructions={instructions}
                  filteredInstructions={filteredInstructions}
                  currentInstructionId={currentInstructionId}
                  setCurrentInstructionId={setCurrentInstructionId}
                  instructionSearch={instructionSearch}
                  setInstructionSearch={setInstructionSearch}
                  handleAddInstruction={handleAddInstruction}
                  themeClasses={themeClasses}
                  darkMode={darkMode}
                />

                <div className="text-center pt-3">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!dossierId || selectedInstructions.length === 0 || submitLoading}
                    variant="primary"
                    size="lg"
                    className="px-5 py-2 fw-bold me-2"
                  >
                    {submitLoading ? 'Attribution en cours...' : `Attribuer ${selectedInstructions.length} instruction(s)`}
                  </Button>
                  {selectedInstructions.length > 0 && (
                    <Button type="button" variant="outline-danger" size="lg" onClick={handleClearAll}>
                      Tout effacer
                    </Button>
                  )}
                </div>
              </Col>

              <Col lg={5}>
                <SelectedInstructionsList
                  selectedInstructions={selectedInstructions}
                  handleRemoveInstruction={handleRemoveInstruction}
                  themeClasses={themeClasses}
                />

                {(!dossierId || selectedInstructions.length === 0) && (
                  <Alert variant="warning" className="mt-3 border-0">
                    <FaExclamationTriangle className="me-2" />
                    {!dossierId && !selectedInstructions.length
                      ? 'Sélectionnez un dossier et ajoutez des instructions.'
                      : !dossierId ? 'Sélectionnez un dossier.' : 'Ajoutez au moins une instruction.'}
                  </Alert>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Modal Nouvelle instruction */}
      <NewInstructionModal
        show={showNewInstructionModal}
        setShow={setShowNewInstructionModal}
        fetchData={fetchData}
        setSelectedInstructions={setSelectedInstructions}
        quickInstructionTemplates={quickInstructionTemplates}
        themeClasses={themeClasses}
      />

       <div className={`min-vh-100 py-5 ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={11}>
            <Tabs activeKey={tab} onSelect={(k) => setTab(k)} className="mb-4">
              
              {/* TAB 1 - Gestion */}
              <Tab eventKey="gestion" title="Attribuer Instructions">
                {/* === هادي هي الصفحة ديالك الحالية (الكود ديال AddInstructionPage) === */}
              </Tab>

              {/* TAB 2 - Liste */}
              <Tab eventKey="liste" title="Liste des Instructions">
                <InstructionListPage darkMode={darkMode} />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
    </div>
  );
};

export default AddInstructionPage;
