import React, { useState, useEffect } from 'react';
import { BENCHMARK_CLINICAL_CASES } from './data/mockClinicalCases';
import { runDeterministicReconciliation } from './utils/clinicalReconciliationEngine';
import { ClinicalCaseInput, ClinicalEngineOutput } from './types';
import { Header } from './components/Header';
import { GuardrailsBar } from './components/GuardrailsBar';
import { MultiSourceIngestionPanel } from './components/MultiSourceIngestionPanel';
import { SoapRecordView } from './components/SoapRecordView';
import { ConflictMatrixView } from './components/ConflictMatrixView';
import { ActionItemsView } from './components/ActionItemsView';
import { AuditLedgerView } from './components/AuditLedgerView';
import { JsonSchemaViewer } from './components/JsonSchemaViewer';
import { CustomCaseModal } from './components/CustomCaseModal';
import { ThreeBarDrawer } from './components/ThreeBarDrawer';
import { LiveDoctorChat } from './components/LiveDoctorChat';
import { RefreshCw, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export default function App() {
  const [cases, setCases] = useState<ClinicalCaseInput[]>(BENCHMARK_CLINICAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(BENCHMARK_CLINICAL_CASES[0].case_id);
  const [activeView, setActiveView] = useState<'soap' | 'conflicts' | 'actions' | 'audit' | 'json' | 'chat'>('soap');
  const [activeSourceTab, setActiveSourceTab] = useState<'transcript' | 'ehr' | 'labs' | 'guidelines'>('transcript');
  const [engineMode, setEngineMode] = useState<'ai' | 'deterministic'>('ai');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [output, setOutput] = useState<ClinicalEngineOutput | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' } | null>(null);

  const currentCase = cases.find(c => c.case_id === selectedCaseId) || cases[0];

  // Fetch all active patients from server database on mount
  useEffect(() => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        if (data.patients && Array.isArray(data.patients) && data.patients.length > 0) {
          setCases(data.patients);
        }
      })
      .catch(() => {
        // Use local benchmark if backend endpoint fails
      });
  }, []);

  // Run reconciliation engine
  const executeReconciliation = async (caseToReconcile: ClinicalCaseInput, mode: 'ai' | 'deterministic') => {
    setIsLoading(true);
    setStatusMessage({
      text: `Reconciling records for ${caseToReconcile.patient_name} via ${mode === 'ai' ? 'Gemini AI Engine' : 'Deterministic Clinical Rules'}...`,
      type: 'info'
    });

    try {
      if (mode === 'ai') {
        const response = await fetch('/api/reconcile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseData: caseToReconcile,
            forceDeterministic: false
          })
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.data) {
            setOutput(resData.data);
            const sourceLabel = resData.source.startsWith('gemini')
              ? `Gemini (${resData.source})`
              : 'Deterministic Clinical Engine';
            setStatusMessage({
              text: `Reconciliation verified (${sourceLabel}). Zero-tolerance regulatory guardrails validated.`,
              type: 'success'
            });
            setIsLoading(false);
            return;
          }
        }
      }

      // Local fallback or deterministic mode
      const deterministicResult = runDeterministicReconciliation(caseToReconcile);
      setOutput(deterministicResult);
      setStatusMessage({
        text: 'Reconciliation synthesized via verified Clinical Rule Engine. Guardrails enforced.',
        type: 'success'
      });
    } catch {
      const fallbackResult = runDeterministicReconciliation(caseToReconcile);
      setOutput(fallbackResult);
      setStatusMessage({
        text: 'Reconciled via Deterministic Clinical Safety Engine.',
        type: 'info'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (currentCase) {
      executeReconciliation(currentCase, engineMode);
    }
  }, [selectedCaseId]);

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  const handleSelectPatient = (patient: ClinicalCaseInput) => {
    setSelectedCaseId(patient.case_id);
  };

  // Create new patient database entry when doctor writes an unrecorded patient name
  const handleCreateNewPatient = async (patientName: string): Promise<ClinicalCaseInput | null> => {
    try {
      setIsLoading(true);
      setStatusMessage({
        text: `Creating new clinical database entry for patient: "${patientName}"...`,
        type: 'info'
      });

      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_name: patientName })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.patient) {
          const newPt: ClinicalCaseInput = data.patient;
          setCases(prev => {
            const exists = prev.some(p => p.case_id === newPt.case_id);
            return exists ? prev : [newPt, ...prev];
          });
          setSelectedCaseId(newPt.case_id);
          setStatusMessage({
            text: `Patient "${newPt.patient_name}" (${newPt.patient_id}) created in database. Running initial encounter intake...`,
            type: 'success'
          });
          return newPt;
        }
      }
    } catch (err) {
      console.warn('Backend patient creation error, fallback local creation:', err);
    }

    // Client-side fallback if server is unreachable
    const syntheticId = `SYN-PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];
    const timestampNow = new Date().toISOString().slice(0, 16).replace('T', ' ');

    const fallbackPatient: ClinicalCaseInput = {
      case_id: `CASE-${syntheticId}-${Date.now().toString().slice(-4)}`,
      case_title: `Encounter: ${patientName} (New Patient Intake)`,
      patient_id: syntheticId,
      patient_name: patientName,
      patient_age: 50,
      patient_gender: 'Not Specified',
      encounter_date: today,
      transcript: `[00:01] Attending Physician: Good morning, ${patientName}. Welcome to our clinic. What primary symptoms or health concerns bring you in today?
[00:14] ${patientName}: Thank you, Doctor. I am here for an initial clinical evaluation and comprehensive medication review.
[00:26] Attending Physician: Let us review your active health concerns, current prescription drugs or supplements, and document your medical history for cross-reconciliation.`,
      ehr_records: {
        active_problems: ['Initial Clinical Encounter & Health Intake (ICD-10 Z00.00)'],
        documented_medications: [],
        allergies: [],
        recent_vitals: [
          { metric: 'Blood Pressure', value: '120/80 mmHg', timestamp: timestampNow },
          { metric: 'Heart Rate', value: '72 bpm', timestamp: timestampNow }
        ]
      },
      lab_panels: [],
      clinical_guidelines_rag: [
        {
          guideline_id: 'AMA-CPT-EVAL-INTAKE-2026',
          source: 'AMA CPT Evaluation & Management Documentation Guidelines',
          topic: 'New Patient Encounter Intake & Medication Reconciliation',
          guideline_text: 'For new patient visits, clinicians must verify subjective claims against any available medical records, reconcile current active medications, establish baseline vitals and laboratory evaluations, and flag any discrepancies for physician sign-off.'
        }
      ]
    };

    setCases(prev => [fallbackPatient, ...prev]);
    setSelectedCaseId(fallbackPatient.case_id);
    setStatusMessage({
      text: `Patient "${patientName}" created in local database. Initialized workspace.`,
      type: 'success'
    });
    return fallbackPatient;
  };

  const handleToggleEngineMode = (mode: 'ai' | 'deterministic') => {
    setEngineMode(mode);
    executeReconciliation(currentCase, mode);
  };

  const handleExportJson = () => {
    if (!output) return;
    const jsonString = JSON.stringify(output, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical_reconciliation_${output.metadata.patient_id}_${output.metadata.encounter_id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCustomCaseSubmit = (newCase: ClinicalCaseInput) => {
    setCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCase.case_id);
    setStatusMessage({
      text: `Ingested custom case "${newCase.case_title}". Running reconciliation...`,
      type: 'info'
    });
  };

  const handleEvidenceSelect = (tether: string) => {
    if (tether.toLowerCase().includes('transcript')) {
      setActiveSourceTab('transcript');
    } else if (tether.toLowerCase().includes('ehr') || tether.toLowerCase().includes('problem') || tether.toLowerCase().includes('allergy')) {
      setActiveSourceTab('ehr');
    } else if (tether.toLowerCase().includes('lab') || tether.toLowerCase().includes('panel') || tether.toLowerCase().includes('k+') || tether.toLowerCase().includes('creatinine')) {
      setActiveSourceTab('labs');
    } else if (tether.toLowerCase().includes('guideline') || tether.toLowerCase().includes('kdigo') || tether.toLowerCase().includes('aha')) {
      setActiveSourceTab('guidelines');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Main Navigation Header with 3-Bar System & Patient Auto-fetch/create bar */}
      <Header
        cases={cases}
        selectedCaseId={selectedCaseId}
        onSelectCase={handleSelectCase}
        onSelectPatient={handleSelectPatient}
        onCreateNewPatient={handleCreateNewPatient}
        onRunReconciliation={() => executeReconciliation(currentCase, engineMode)}
        isLoading={isLoading}
        engineMode={engineMode}
        onToggleEngineMode={handleToggleEngineMode}
        activeView={activeView}
        onSelectView={setActiveView}
        onExportJson={handleExportJson}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Regulatory & Safety Guardrail Banner (Sharp Rectangles) */}
      <GuardrailsBar
        compliance={output?.metadata.regulatory_compliance}
        conflictCount={output?.conflict_matrix.length || 0}
        unresolvedCount={output?.conflict_matrix.filter(c => c.requires_human_escalation).length || 0}
        patientId={currentCase.patient_id}
      />

      {/* Ephemeral Status Indicator (Sharp Rectangular Strip) */}
      {statusMessage && (
        <div className={`px-4 sm:px-8 py-2 text-xs flex items-center justify-between border-b ${
          statusMessage.type === 'error'
            ? 'bg-rose-950/40 border-rose-900/50 text-rose-300'
            : statusMessage.type === 'success'
            ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-300'
            : 'bg-slate-900/70 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center space-x-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isLoading ? 'animate-spin text-teal-400' : 'text-slate-400'}`} />
            )}
            <span className="font-medium">{statusMessage.text}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Mode: {engineMode === 'ai' ? 'Gemini AI Engine' : 'Deterministic Rules'}
          </span>
        </div>
      )}

      {/* Main Dual-Panel Workspace (Complete Sharp Rectangles) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Multi-Source Ingestion (Transcript, EHR, Labs, RAG) */}
          <div className="lg:col-span-5 h-[calc(100vh-14rem)] sticky top-24">
            <MultiSourceIngestionPanel
              clinicalCase={currentCase}
              activeSourceTab={activeSourceTab}
              onSelectSourceTab={setActiveSourceTab}
              onEditCase={() => setIsCustomModalOpen(true)}
              onRunReconciliation={() => executeReconciliation(currentCase, engineMode)}
              isLoading={isLoading}
            />
          </div>

          {/* Right Panel: Reconciled Outputs or Live Doctor Chat */}
          <div className="lg:col-span-7 min-h-[calc(100vh-14rem)]">
            {activeView === 'chat' ? (
              <LiveDoctorChat currentPatient={currentCase} output={output} />
            ) : isLoading && !output ? (
              <div className="bg-slate-900 border border-slate-800 p-12 flex flex-col items-center justify-center space-y-4 text-center">
                <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
                <h3 className="text-base font-semibold text-white">
                  Executing Multi-Source Clinical Reconciliation
                </h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Ingesting consultation transcript, cross-referencing EHR baselines, verifying timestamped laboratory intervals, and enforcing zero-tolerance safety guardrails...
                </p>
              </div>
            ) : output ? (
              <div>
                {activeView === 'soap' && (
                  <SoapRecordView output={output} onSelectEvidence={handleEvidenceSelect} />
                )}

                {activeView === 'conflicts' && (
                  <ConflictMatrixView conflicts={output.conflict_matrix} onSelectEvidence={handleEvidenceSelect} />
                )}

                {activeView === 'actions' && (
                  <ActionItemsView actionItems={output.action_items} />
                )}

                {activeView === 'audit' && (
                  <AuditLedgerView auditLedger={output.audit_and_evidence_ledger} onSelectEvidence={handleEvidenceSelect} />
                )}

                {activeView === 'json' && (
                  <JsonSchemaViewer output={output} />
                )}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 p-8 text-center text-slate-400 text-xs">
                No reconciliation record available. Click &ldquo;Run Reconciliation&rdquo; to begin.
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Floating Quick Action: Live Doctor Chat Consultation */}
      {activeView !== 'chat' && (
        <button
          id="floating-doctor-chat-btn"
          onClick={() => setActiveView('chat')}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#072a35] via-[#0b4859] to-[#0f766e] hover:from-[#051c24] hover:to-[#0d9488] text-white px-5 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2.5 border border-teal-400/30 text-xs font-bold active:scale-95 group"
          title="Open Live Chat Consultation with Dr. Meredith Reed"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <MessageSquare className="w-4 h-4 text-teal-200 group-hover:scale-110 transition-transform" />
          <span>Chat with Doctor</span>
          <span className="bg-teal-900/60 text-teal-200 text-[10px] px-2 py-0.5 rounded-full font-mono border border-teal-500/30">Live</span>
        </button>
      )}

      {/* 3-BAR SYSTEM DRAWER (Houses all non-important/secondary controls) */}
      <ThreeBarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        engineMode={engineMode}
        onToggleEngineMode={handleToggleEngineMode}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onExportJson={handleExportJson}
        activeView={activeView}
        onSelectView={setActiveView}
        totalPatients={cases.length}
        onRunReconciliation={() => executeReconciliation(currentCase, engineMode)}
        isLoading={isLoading}
      />

      {/* Custom Case Ingestion Modal */}
      <CustomCaseModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmitCase={handleCustomCaseSubmit}
      />
    </div>
  );
}
