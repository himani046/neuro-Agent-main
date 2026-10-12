import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  FileCode2, 
  Menu, 
  User, 
  Sparkles,
  AlertOctagon,
  ListTodo,
  FileCheck2,
  SlidersHorizontal,
  Play,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { ClinicalCaseInput } from '../types';
import { PatientSearchBar } from './PatientSearchBar';

interface HeaderProps {
  cases: ClinicalCaseInput[];
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  onSelectPatient: (patient: ClinicalCaseInput) => void;
  onCreateNewPatient: (patientName: string) => Promise<ClinicalCaseInput | null>;
  onRunReconciliation: () => void;
  isLoading: boolean;
  engineMode: 'ai' | 'deterministic';
  onToggleEngineMode: (mode: 'ai' | 'deterministic') => void;
  activeView: 'soap' | 'conflicts' | 'actions' | 'audit' | 'json' | 'chat';
  onSelectView: (view: 'soap' | 'conflicts' | 'actions' | 'audit' | 'json' | 'chat') => void;
  onExportJson: () => void;
  onOpenCustomModal: () => void;
  onOpenDrawer: () => void;
  conflictCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  cases,
  selectedCaseId,
  onSelectPatient,
  onCreateNewPatient,
  onRunReconciliation,
  isLoading,
  activeView,
  onSelectView,
  onOpenDrawer,
  conflictCount = 0
}) => {
  const currentPatient = cases.find(c => c.case_id === selectedCaseId) || cases[0];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-slate-800 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Logo, Patient Search, and Actions */}
        <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand Identity: neuro Agent */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex items-center space-x-2.5">
              {/* neuro Agent 4-Dot Cross Medical Symbol */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0b4859] to-[#0d9488] p-1.5 flex items-center justify-center shadow-xs">
                <div className="grid grid-cols-2 gap-1 w-full h-full">
                  <div className="bg-white rounded-full"></div>
                  <div className="bg-cyan-200 rounded-full"></div>
                  <div className="bg-cyan-200 rounded-full"></div>
                  <div className="bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                    neuro Agent
                  </span>
                  <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                    Clinical Engine
                  </span>
                </div>
                <p className="text-[10px] text-slate-600">
                  Autonomous Documentation &amp; Reconciliation
                </p>
              </div>
            </div>
          </div>

          {/* Center: Patient Search and Instant Database Intake */}
          <div className="flex-1 max-w-xl w-full">
            <PatientSearchBar
              cases={cases}
              selectedCaseId={selectedCaseId}
              onSelectPatient={onSelectPatient}
              onCreateNewPatient={onCreateNewPatient}
              isLoading={isLoading}
            />
          </div>

          {/* Right: Run Reconciliation Button, Drawer Button & Active Patient pill */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
            {/* Run Reconciliation Button */}
            <button
              id="header-btn-run-reconciliation"
              onClick={onRunReconciliation}
              disabled={isLoading}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 ${
                isLoading
                  ? 'bg-teal-700/60 text-teal-100 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white shadow-teal-700/25 ring-2 ring-teal-600/30'
              }`}
              title="Execute full multi-source clinical reconciliation"
              aria-label="Run Reconciliation"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-200 shrink-0" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current text-white shrink-0" />
              )}
              <span className="whitespace-nowrap">{isLoading ? 'Reconciling...' : 'Run Reconciliation'}</span>
            </button>

            <div className="hidden lg:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 font-medium">Patient:</span>
              <span className="font-semibold text-slate-800">{currentPatient.patient_name}</span>
            </div>

            {/* 3-BAR SYSTEM HAMBURGER BUTTON */}
            <button
              id="header-btn-menu-drawer"
              onClick={onOpenDrawer}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors flex items-center justify-center shadow-xs"
              title="Open 3-bar system menu (Engine settings, raw schema, compliance, export)"
              aria-label="Open 3-bar system drawer"
            >
              <Menu className="h-5 w-5 text-teal-700" />
            </button>
          </div>
        </div>

        {/* Bottom Tier: View Switcher (SOAP, Conflict Matrix, Action Items, Evidence, JSON) */}
        <div className="py-2 border-t border-slate-100 flex items-center justify-between overflow-x-auto">
          <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Clinical Views">
            <button
              onClick={() => onSelectView('soap')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeView === 'soap'
                  ? 'bg-[#093d4c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>SOAP Record</span>
            </button>

            <button
              onClick={() => onSelectView('conflicts')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeView === 'conflicts'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Conflict Matrix</span>
              {conflictCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeView === 'conflicts' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  {conflictCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectView('actions')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeView === 'actions'
                  ? 'bg-[#093d4c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Action Items</span>
            </button>

            <button
              onClick={() => onSelectView('audit')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeView === 'audit'
                  ? 'bg-[#093d4c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Evidence Ledger</span>
            </button>

            <button
              onClick={() => onSelectView('json')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeView === 'json'
                  ? 'bg-[#093d4c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>JSON Schema</span>
            </button>

            {/* Live Doctor Chat Tab */}
            <button
              id="header-tab-doctor-chat"
              onClick={() => onSelectView('chat')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeView === 'chat'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-teal-800 bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200/80'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>Live Doctor Chat</span>
            </button>
          </nav>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 font-mono">
            <span>Encounter: {currentPatient.encounter_date}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
