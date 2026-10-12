import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  AlertOctagon, 
  CheckCircle2, 
  UserCheck, 
  Pill, 
  Activity, 
  FileWarning,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { ConflictMatrixItem, ConflictType } from '../types';

interface ConflictMatrixViewProps {
  conflicts: ConflictMatrixItem[];
  onSelectEvidence?: (tether: string) => void;
}

export const ConflictMatrixView: React.FC<ConflictMatrixViewProps> = ({ conflicts }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [resolvedStatus, setResolvedStatus] = useState<Record<string, boolean>>({});

  const toggleResolved = (id: string) => {
    setResolvedStatus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredConflicts = conflicts.filter(c => {
    if (filterType === 'ALL') return true;
    return c.conflict_type === filterType;
  });

  const getConflictTypeBadge = (type: ConflictType) => {
    switch (type) {
      case 'Dosage_Mismatch':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold rounded-full">DOSAGE MISMATCH</span>;
      case 'Allergy_Cross_Reactivity':
        return <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold rounded-full">ALLERGY CLASH</span>;
      case 'Objective_Lab_Deviation_Correlation':
        return <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold rounded-full">LAB DEVIATION</span>;
      case 'Adherence_Gap':
        return <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 text-[10px] font-bold rounded-full">ADHERENCE GAP</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold rounded-full">CONTRADICTION</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Urgent':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold rounded-full">URGENT TIER</span>;
      case 'Priority':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold rounded-full">PRIORITY TIER</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold rounded-full">ROUTINE TIER</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Zero Tolerance Warning */}
      <div className="bg-white rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl shrink-0 mt-0.5 border border-amber-200/60">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-slate-900">
                Conflict &amp; Safety Escalation Matrix
              </h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-bold">
                requires_human_escalation: true
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every contradiction identified between subjective dialogue, historical EHR orders, and timestamped lab panels is strictly extracted into this matrix with automated escalation flags. Non-prescriptive; clinical action requires attending physician review.
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 font-medium">Filter by Type:</span>
            <select
              aria-label="Filter by conflict type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
            >
              <option value="ALL">All Conflicts ({conflicts.length})</option>
              <option value="Dosage_Mismatch">Dosage Mismatch</option>
              <option value="Allergy_Cross_Reactivity">Allergy Cross-Reactivity</option>
              <option value="Objective_Lab_Deviation_Correlation">Lab Deviation Correlation</option>
              <option value="Adherence_Gap">Adherence Gap</option>
            </select>
          </div>

          <div className="text-slate-500 text-xs font-mono">
            Showing {filteredConflicts.length} of {conflicts.length} Identified Discrepancies
          </div>
        </div>
      </div>

      {/* Conflict Cards */}
      <div className="space-y-4">
        {filteredConflicts.map((conflict, idx) => {
          const isResolved = resolvedStatus[conflict.conflict_id];
          return (
            <div
              key={conflict.conflict_id || idx}
              className={`bg-white rounded-3xl border overflow-hidden shadow-xs transition-all ${
                isResolved
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="bg-slate-50/70 px-5 py-3.5 border-b border-slate-150 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-md">
                    {conflict.conflict_id}
                  </span>
                  {getConflictTypeBadge(conflict.conflict_type)}
                  {getSeverityBadge(conflict.severity)}
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => toggleResolved(conflict.conflict_id)}
                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                      isResolved
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {isResolved ? (
                      <>
                        <Check className="w-3 h-3 mr-1 text-emerald-600" />
                        Human Verified
                      </>
                    ) : (
                      'Mark Human Verified'
                    )}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-4 text-xs">
                {/* Discrepancy Description */}
                <div>
                  <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-1.5">
                    Discrepancy Synthesis:
                  </div>
                  <p className="text-sm font-bold text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed">
                    {conflict.discrepancy_description}
                  </p>
                </div>

                {/* Sources Involved Grid */}
                <div>
                  <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2.5">
                    Multi-Source Ingestion Contradiction Map:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Subjective Source */}
                    {conflict.sources_involved.subjective_transcript && (
                      <div className="bg-cyan-50/50 p-3.5 rounded-2xl border border-cyan-100">
                        <div className="flex items-center justify-between text-[11px] font-bold text-cyan-900 mb-1">
                          <span>Subjective Consultation Dialogue</span>
                          <span className="text-[10px] text-cyan-600 font-mono">Transcript</span>
                        </div>
                        <p className="text-slate-700 text-xs italic leading-relaxed">
                          &ldquo;{conflict.sources_involved.subjective_transcript}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* EHR Source */}
                    {conflict.sources_involved.historical_ehr && (
                      <div className="bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100">
                        <div className="flex items-center justify-between text-[11px] font-bold text-sky-900 mb-1">
                          <span>Historical EHR Baseline</span>
                          <span className="text-[10px] text-sky-600 font-mono">EHR Active Record</span>
                        </div>
                        <p className="text-slate-700 text-xs leading-relaxed">
                          {conflict.sources_involved.historical_ehr}
                        </p>
                      </div>
                    )}

                    {/* Laboratory Source */}
                    {conflict.sources_involved.laboratory_panel && (
                      <div className="bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100">
                        <div className="flex items-center justify-between text-[11px] font-bold text-purple-900 mb-1">
                          <span>Timestamped Laboratory Panel</span>
                          <span className="text-[10px] text-purple-600 font-mono">Diagnostic Report</span>
                        </div>
                        <p className="text-slate-700 text-xs font-mono leading-relaxed">
                          {conflict.sources_involved.laboratory_panel}
                        </p>
                      </div>
                    )}

                    {/* Guideline / RAG Source */}
                    {conflict.sources_involved.clinical_guideline_rag && (
                      <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100">
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-1">
                          <span>Clinical Guideline Reference (RAG)</span>
                          <span className="text-[10px] text-amber-600 font-mono">Practice Standard</span>
                        </div>
                        <p className="text-slate-700 text-xs leading-relaxed">
                          {conflict.sources_involved.clinical_guideline_rag}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Risk Assessment & Escalation Target */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                  <div className="text-slate-600">
                    <span className="text-slate-400 font-bold">Risk Profile: </span>
                    <span className="font-medium text-slate-800">{conflict.clinical_risk_assessment_non_prescriptive}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-slate-500 font-medium">Escalation Assigned To:</span>
                    <span className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 font-bold font-mono text-[11px] rounded-full">
                      {conflict.recommended_escalation_target.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
