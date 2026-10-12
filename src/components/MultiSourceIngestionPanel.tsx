import React, { useState } from 'react';
import { 
  FileText, 
  Database, 
  TestTubes, 
  BookOpen, 
  Search, 
  Clock, 
  Pill, 
  Copy,
  Check,
  Activity,
  Heart,
  AlertCircle,
  Play,
  RefreshCw
} from 'lucide-react';
import { ClinicalCaseInput } from '../types';

interface MultiSourceIngestionPanelProps {
  clinicalCase: ClinicalCaseInput;
  activeSourceTab: 'transcript' | 'ehr' | 'labs' | 'guidelines';
  onSelectSourceTab: (tab: 'transcript' | 'ehr' | 'labs' | 'guidelines') => void;
  highlightedKeyword?: string;
  onEditCase?: () => void;
  onRunReconciliation?: () => void;
  isLoading?: boolean;
}

export const MultiSourceIngestionPanel: React.FC<MultiSourceIngestionPanelProps> = ({
  clinicalCase,
  activeSourceTab,
  onSelectSourceTab,
  onEditCase,
  onRunReconciliation,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const copyTranscript = () => {
    navigator.clipboard.writeText(clinicalCase.transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const parseTranscriptLines = (transcript: string) => {
    return transcript.split('\n').filter(line => line.trim().length > 0).map((line, idx) => {
      const match = line.match(/^\[(.*?)\]\s*([^:]+):\s*(.*)$/);
      if (match) {
        return {
          id: idx,
          timestamp: match[1],
          speaker: match[2].trim(),
          text: match[3].trim()
        };
      }
      return {
        id: idx,
        timestamp: '--:--',
        speaker: 'Unknown',
        text: line
      };
    });
  };

  const parsedLines = parseTranscriptLines(clinicalCase.transcript);

  const filteredLines = parsedLines.filter(item => 
    !searchTerm || 
    item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.speaker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Panel Header & Navigation */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Clinical Ingestion Sources
            </h2>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {clinicalCase.patient_name}
          </span>
        </div>

        {/* Source Tabs (Clean neuro Agent Pill Bar) */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl text-xs">
          <button
            onClick={() => onSelectSourceTab('transcript')}
            className={`flex items-center justify-center py-2 px-1 font-semibold rounded-xl transition-all ${
              activeSourceTab === 'transcript'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 mr-1 hidden sm:inline text-teal-600" />
            <span>Dialogue</span>
          </button>

          <button
            onClick={() => onSelectSourceTab('ehr')}
            className={`flex items-center justify-center py-2 px-1 font-semibold rounded-xl transition-all ${
              activeSourceTab === 'ehr'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5 mr-1 hidden sm:inline text-teal-600" />
            <span>EHR</span>
          </button>

          <button
            onClick={() => onSelectSourceTab('labs')}
            className={`flex items-center justify-center py-2 px-1 font-semibold rounded-xl transition-all ${
              activeSourceTab === 'labs'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TestTubes className="w-3.5 h-3.5 mr-1 hidden sm:inline text-teal-600" />
            <span>Labs</span>
          </button>

          <button
            onClick={() => onSelectSourceTab('guidelines')}
            className={`flex items-center justify-center py-2 px-1 font-semibold rounded-xl transition-all ${
              activeSourceTab === 'guidelines'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1 hidden sm:inline text-teal-600" />
            <span>RAG</span>
          </button>
        </div>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        
        {/* TAB 1: CONSULTATION TRANSCRIPT */}
        {activeSourceTab === 'transcript' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="relative flex-1 mr-3">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter dialogue turns or medication mentions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-250 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>
              <button
                onClick={copyTranscript}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
                title="Copy full transcript"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              {filteredLines.map((line) => {
                const isDoctor = line.speaker.toLowerCase().includes('dr') || line.speaker.toLowerCase().includes('reed') || line.speaker.toLowerCase().includes('patel') || line.speaker.toLowerCase().includes('lin') || line.speaker.toLowerCase().includes('physician');
                return (
                  <div
                    key={line.id}
                    className={`p-3.5 rounded-2xl border transition-all text-xs leading-relaxed ${
                      isDoctor
                        ? 'bg-slate-50/70 border-slate-200 text-slate-700'
                        : 'bg-cyan-50/50 border-cyan-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 text-[11px]">
                      <span className={`font-bold ${isDoctor ? 'text-teal-700' : 'text-cyan-800'}`}>
                        {line.speaker}
                      </span>
                      <span className="flex items-center text-slate-400 font-mono text-[10px]">
                        <Clock className="w-3 h-3 mr-1" />
                        {line.timestamp}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{line.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: HISTORICAL EHR RECORDS */}
        {activeSourceTab === 'ehr' && (
          <div className="space-y-4 text-xs">
            {/* Active Problem List */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
                <span className="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
                Active Problem List (ICD-10 Baselines)
              </h3>
              <ul className="space-y-2">
                {clinicalCase.ehr_records.active_problems.map((prob, i) => (
                  <li key={i} className="flex items-start text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
                    <span className="font-mono text-teal-600 mr-2 font-bold">#{i + 1}</span>
                    <span className="font-medium">{prob}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documented Medication Regimen */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
                <Pill className="w-4 h-4 text-teal-600 mr-1.5" />
                Documented Medication Regimen
              </h3>
              <div className="space-y-2.5">
                {clinicalCase.ehr_records.documented_medications.length > 0 ? (
                  clinicalCase.ehr_records.documented_medications.map((med, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{med.drug} {med.dosage}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                          Refill: {med.last_refill}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center justify-between">
                        <span>Frequency: {med.frequency}</span>
                        <span>Route: {med.route}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No historical medications recorded.</p>
                )}
              </div>
            </div>

            {/* Allergies & Vitals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-3.5">
                <h4 className="font-bold text-slate-700 mb-2 text-xs flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500 mr-1.5" />
                  Allergies
                </h4>
                {clinicalCase.ehr_records.allergies.length > 0 ? (
                  clinicalCase.ehr_records.allergies.map((al, idx) => (
                    <div key={idx} className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-rose-900">
                      <div className="font-bold">{al.allergen}</div>
                      <div className="text-[11px] text-rose-700">{al.reaction} ({al.severity})</div>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400">NKDA (No known drug allergies)</span>
                )}
              </div>

              <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-3.5">
                <h4 className="font-bold text-slate-700 mb-2 text-xs flex items-center">
                  <Heart className="w-3.5 h-3.5 text-teal-600 mr-1.5" />
                  Recent Vitals
                </h4>
                <div className="space-y-1 text-slate-600">
                  {clinicalCase.ehr_records.recent_vitals.map((v, idx) => (
                    <div key={idx} className="flex justify-between bg-white px-2 py-1 rounded-lg border border-slate-100">
                      <span>{v.metric}:</span>
                      <strong className="text-slate-800">{v.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LAB PANELS */}
        {activeSourceTab === 'labs' && (
          <div className="space-y-3 text-xs">
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
                <TestTubes className="w-4 h-4 text-teal-600 mr-1.5" />
                Timestamped Laboratory Diagnostic Findings
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                      <th className="py-2 px-2 font-semibold">Analyte</th>
                      <th className="py-2 px-2 font-semibold">Observed Value</th>
                      <th className="py-2 px-2 font-semibold">Ref Interval</th>
                      <th className="py-2 px-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clinicalCase.lab_panels.map((lab, i) => {
                      const isHigh = lab.flag === 'HIGH' || lab.flag === 'CRITICAL_HIGH';
                      const isLow = lab.flag === 'LOW' || lab.flag === 'CRITICAL_LOW';
                      return (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-2 font-semibold text-slate-800">
                            {lab.test_name}
                          </td>
                          <td className="py-2.5 px-2 font-mono font-bold text-slate-900">
                            {lab.value} {lab.unit}
                          </td>
                          <td className="py-2.5 px-2 text-slate-500 text-[11px]">
                            {lab.reference_interval}
                          </td>
                          <td className="py-2.5 px-2">
                            {isHigh ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                HIGH
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                LOW
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                NORMAL
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RAG GUIDELINES */}
        {activeSourceTab === 'guidelines' && (
          <div className="space-y-3 text-xs">
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center">
                <BookOpen className="w-4 h-4 text-teal-600 mr-1.5" />
                Retrieved Clinical Practice Guidelines (RAG Grounding)
              </h3>

              <div className="space-y-3">
                {clinicalCase.clinical_guidelines_rag.map((guide, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold">
                        {guide.guideline_id}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">Verified RAG Corpus</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-xs">{guide.topic}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{guide.guideline_text}</p>
                    <div className="text-[10px] text-slate-400 pt-1 font-medium">{guide.source}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Action Bar: Run Reconciliation */}
      {onRunReconciliation && (
        <div className="p-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-medium flex items-center">
            <Activity className="w-3.5 h-3.5 mr-1.5 text-teal-600 shrink-0" />
            <span className="truncate">Multi-source inputs ready</span>
          </div>
          <button
            id="panel-btn-run-reconciliation"
            onClick={onRunReconciliation}
            disabled={isLoading}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 shrink-0 ${
              isLoading
                ? 'bg-teal-700/60 text-teal-100 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white shadow-teal-700/20'
            }`}
            title="Execute clinical reconciliation on active patient sources"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-200" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current text-white" />
            )}
            <span>{isLoading ? 'Reconciling...' : 'Run Reconciliation'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
