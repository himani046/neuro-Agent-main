import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck
} from 'lucide-react';
import { ClinicalEngineOutput } from '../types';

interface JsonSchemaViewerProps {
  output: ClinicalEngineOutput;
}

export const JsonSchemaViewer: React.FC<JsonSchemaViewerProps> = ({ output }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(output, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
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

  return (
    <div className="space-y-4">
      {/* Header with copy & download controls */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
              VALIDATED SCHEMA COMPLIANT
            </span>
            <span className="text-xs text-slate-500 font-mono">
              JSON UTF-8 • Strict Regulatory Format
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            Structured Machine-Readable Output
          </h2>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Copied JSON
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                Copy JSON
              </>
            )}
          </button>

          <button
            onClick={downloadJson}
            className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-full shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download .json
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 font-mono text-xs overflow-x-auto shadow-inner">
        <pre className="text-emerald-400 leading-relaxed font-mono whitespace-pre">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
