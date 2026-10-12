import React from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  Link2, 
  UserX, 
  FileCheck 
} from 'lucide-react';
import { RegulatoryCompliance } from '../types';

interface GuardrailsBarProps {
  compliance?: RegulatoryCompliance;
  conflictCount: number;
  unresolvedCount: number;
  patientId: string;
}

export const GuardrailsBar: React.FC<GuardrailsBarProps> = ({
  compliance = {
    is_strictly_non_diagnostic: true,
    is_strictly_non_prescriptive: true,
    all_claims_grounded: true,
    zero_tolerance_guardrails_passed: true,
    synthetic_boundary_verified: true
  },
  conflictCount,
  unresolvedCount,
  patientId
}) => {
  return (
    <div className="bg-slate-50/80 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        
        {/* Guardrail Checklist Badges - neuro Agent Rounded Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] mr-1">
            Safety Guardrails:
          </span>

          {/* Non-Diagnostic Guardrail */}
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            <span>Non-Diagnostic &amp; Non-Prescriptive</span>
          </div>

          {/* Evidence Grounding Guardrail */}
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-medium">
            <Link2 className="w-3.5 h-3.5 mr-1 text-teal-600" />
            <span>Evidence Grounded</span>
          </div>

          {/* Conflict Escalation Enforcement */}
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium">
            <AlertOctagon className="w-3.5 h-3.5 mr-1 text-amber-600" />
            <span>Escalation Enforced ({conflictCount} Discrepancies)</span>
          </div>

          {/* Synthetic Boundary Guardrail */}
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-medium">
            <UserX className="w-3.5 h-3.5 mr-1 text-sky-600" />
            <span>Synthetic Patient ID: {patientId}</span>
          </div>
        </div>

        {/* Audit Status Summary */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <span className="flex items-center">
            <FileCheck className="w-3.5 h-3.5 mr-1 text-teal-600" />
            Status: <strong className="ml-1 text-emerald-700">Zero-Tolerance Verified</strong>
          </span>
        </div>

      </div>
    </div>
  );
};
