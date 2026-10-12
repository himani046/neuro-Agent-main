import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Calendar,
  ArrowRight,
  RefreshCw,
  Clock
} from 'lucide-react';
import { ClinicalCaseInput, ClinicalEngineOutput } from '../types';

interface NeuroAgentHeroBannerProps {
  currentPatient: ClinicalCaseInput;
  output: ClinicalEngineOutput | null;
  isLoading: boolean;
  onRunReconciliation: () => void;
  engineMode: 'ai' | 'deterministic';
}

export const NeuroAgentHeroBanner: React.FC<NeuroAgentHeroBannerProps> = ({
  currentPatient,
  output,
  isLoading,
  onRunReconciliation,
  engineMode
}) => {
  const conflictCount = output?.conflict_matrix.length ?? 0;
  const escalationCount = output?.conflict_matrix.filter(c => c.requires_human_escalation).length ?? 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c3e4c] via-[#09323f] to-[#041d26] text-white shadow-xl border border-teal-800/40 p-6 sm:p-8 mb-8">
      {/* Background ambient decorative glow */}
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Left Side: Brand Statement & Primary Action */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-500/30 text-teal-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>neuro Agent Clinical Intelligence</span>
            <span className="text-teal-400/50">•</span>
            <span>Team Dynamic coder</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Advanced <span className="font-serif italic font-normal text-cyan-200">Healthcare Documentation With</span> Human Touch
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
            Autonomous multi-source reconciliation converting raw consultation dialogue, historical EHR baselines, and timestamped laboratory panels into auditable, verified SOAP records.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onRunReconciliation}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-[#041d26] font-semibold text-sm transition-all shadow-md hover:shadow-cyan-500/25 active:scale-98 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Reconciling Records...</span>
                </>
              ) : (
                <>
                  <span>Run Clinical Reconciliation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>Strictly Non-Diagnostic &amp; Non-Prescriptive</span>
            </div>
          </div>
        </div>

        {/* Right Side: Active Patient Snapshot Card (neuro Agent Frosted Glass Style) */}
        <div className="w-full lg:w-80 shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-inner flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-cyan-400/20 border border-cyan-300/40 flex items-center justify-center text-cyan-200 font-bold text-sm">
                {currentPatient.patient_name.slice(0, 1)}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white leading-snug">
                  {currentPatient.patient_name}
                </h3>
                <span className="font-mono text-[11px] text-cyan-300">
                  {currentPatient.patient_id}
                </span>
              </div>
            </div>

            <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30">
              Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-black/20 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-400 block mb-0.5">Demographics</span>
              <span className="font-medium text-white">
                {currentPatient.patient_age}y • {currentPatient.patient_gender}
              </span>
            </div>
            <div className="bg-black/20 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-400 block mb-0.5">Encounter</span>
              <span className="font-medium text-white flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-cyan-300" />
                {currentPatient.encounter_date}
              </span>
            </div>
          </div>

          <div className="bg-teal-950/40 border border-teal-500/30 rounded-xl p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Safety Discrepancies:</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                conflictCount > 0 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-emerald-400/20 text-emerald-300'
              }`}>
                {conflictCount} Detected
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Physician Escalation:</span>
              <span className="text-cyan-300 font-medium">
                {escalationCount > 0 ? `${escalationCount} Mandatory Sign-offs` : 'Verified Baseline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
