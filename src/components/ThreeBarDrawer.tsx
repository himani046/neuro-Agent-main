import React from 'react';
import { 
  X, 
  Sparkles, 
  Cpu, 
  Download, 
  SlidersHorizontal, 
  FileCode2, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Info,
  Database,
  CheckCircle2,
  AlertOctagon,
  Link2,
  UserX,
  Play,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { ClinicalCaseInput } from '../types';

interface ThreeBarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  engineMode: 'ai' | 'deterministic';
  onToggleEngineMode: (mode: 'ai' | 'deterministic') => void;
  onOpenCustomModal: () => void;
  onExportJson: () => void;
  activeView: 'soap' | 'conflicts' | 'actions' | 'audit' | 'json' | 'chat';
  onSelectView: (view: 'soap' | 'conflicts' | 'actions' | 'audit' | 'json' | 'chat') => void;
  totalPatients: number;
  onRunReconciliation?: () => void;
  isLoading?: boolean;
}

export const ThreeBarDrawer: React.FC<ThreeBarDrawerProps> = ({
  isOpen,
  onClose,
  engineMode,
  onToggleEngineMode,
  onOpenCustomModal,
  onExportJson,
  activeView,
  onSelectView,
  totalPatients,
  onRunReconciliation,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 text-slate-800 flex flex-col shadow-2xl">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-wide">
                  neuro Agent System Drawer
                </h3>
                <p className="text-[11px] text-slate-500">
                  Auxiliary Controls &amp; Administrative Utilities
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-white border border-slate-200 transition-colors shadow-xs"
              title="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 divide-y divide-slate-100">
            
            {/* 1. Reconciliation Engine Mode */}
            <div className="pt-1 first:pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                  <Activity className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                  Engine Execution Mode
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Server Proxy</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Toggle between cloud Gemini AI with multi-model fallback or the deterministic clinical safety engine.
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onToggleEngineMode('ai')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    engineMode === 'ai'
                      ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Gemini AI Engine</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-snug">
                    Structured LLM reasoning with model fallback
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleEngineMode('deterministic')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    engineMode === 'deterministic'
                      ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-bold text-xs">
                    <Cpu className="w-3.5 h-3.5 text-teal-600" />
                    <span>Clinical Rules</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-snug">
                    Deterministic zero-delay offline rules
                  </div>
                </button>
              </div>

              {/* Run Reconciliation Action in Drawer */}
              {onRunReconciliation && (
                <div className="pt-2">
                  <button
                    id="drawer-btn-run-reconciliation"
                    onClick={() => {
                      onRunReconciliation();
                      onClose();
                    }}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-sm disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-200" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current text-white" />
                    )}
                    <span>{isLoading ? 'Reconciling Sources...' : 'Run Reconciliation Now'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Patient Database & Ingestion Tools */}
            <div className="pt-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                <Database className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                Data &amp; Ingestion Tools
              </span>
              <p className="text-xs text-slate-500">
                Active clinical database currently maintains <strong className="text-slate-800">{totalPatients} patient records</strong>.
              </p>
              
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenCustomModal();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs transition-colors font-medium shadow-xs"
                >
                  <div className="flex items-center space-x-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
                    <span>Custom JSON / Transcript Ingestion</span>
                  </div>
                  <span className="text-slate-400">&rarr;</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onExportJson();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs transition-colors font-medium shadow-xs"
                >
                  <div className="flex items-center space-x-2">
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export Patient Reconciliation JSON</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">.json</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onSelectView('json');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs transition-colors font-medium shadow-xs"
                >
                  <div className="flex items-center space-x-2">
                    <FileCode2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Inspect Raw Clinical JSON Schema</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">View</span>
                </button>

                <a
                  href="/api/download-all-code"
                  download="ALL_PROJECT_CODE.md"
                  onClick={() => onClose()}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-900 text-xs transition-colors font-semibold shadow-xs"
                >
                  <div className="flex items-center space-x-2">
                    <Download className="w-3.5 h-3.5 text-teal-600" />
                    <span>Download All Generated Code (.md)</span>
                  </div>
                  <span className="text-[10px] text-teal-700 font-mono">.md</span>
                </a>
              </div>
            </div>

            {/* 3. Output View Switcher */}
            <div className="pt-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                Active View Selector
              </span>
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {[
                  { id: 'soap', label: 'Structured SOAP Record' },
                  { id: 'conflicts', label: 'Conflict & Escalation Matrix' },
                  { id: 'actions', label: 'Action Items by Urgency & Role' },
                  { id: 'audit', label: 'Evidence Grounding Ledger' },
                  { id: 'json', label: 'Standard Schema JSON' },
                  { id: 'chat', label: 'Live Chat with Doctor (Interactive Consultation)' }
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => {
                      onSelectView(view.id as any);
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                      activeView === view.id
                        ? 'bg-teal-600 text-white font-bold border-teal-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{view.label}</span>
                    {activeView === view.id && (
                      <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full">ACTIVE</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Regulatory Safety Guardrails Reference */}
            <div className="pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Zero-Tolerance Guardrails
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-bold">
                  Enforced
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-600 pt-1">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="font-bold text-emerald-800 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                    Strictly Non-Diagnostic &amp; Non-Prescriptive
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    System functions exclusively as an administrative reconciler. Cannot create de novo clinical diagnoses or modify drug dosages.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="font-bold text-teal-800 flex items-center">
                    <Link2 className="w-3.5 h-3.5 mr-1.5 text-teal-600 shrink-0" />
                    100% Evidence Grounding
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Every statement must tie to dialogue quotes, historical EHR rows, or timestamped laboratory findings.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="font-bold text-amber-800 flex items-center">
                    <AlertOctagon className="w-3.5 h-3.5 mr-1.5 text-amber-600 shrink-0" />
                    Mandatory Human Escalation
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Every detected conflict requires human physician sign-off with escalation routing to Attending Physician, Pharmacy, or Care Coordinator.
                  </div>
                </div>
              </div>
            </div>

            {/* 5. System & Team Credits */}
            <div className="pt-5 space-y-2 text-xs text-slate-500">
              <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
                <Info className="w-3.5 h-3.5 text-teal-600" />
                <span>System Architecture</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1 font-mono text-[11px]">
                <div>Brand: neuro Agent Clinical Documentation</div>
                <div>Team: Team Dynamic coder</div>
                <div>Frontend: React 18 + Vite + Tailwind CSS</div>
                <div>Backend: Node.js Express API + Gemini Generative AI SDK</div>
                <div>Status: Regulatory Guardrails Passing</div>
              </div>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>neuro Agent • Team Dynamic coder</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-full font-medium transition-colors"
            >
              Close Menu
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
