import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Quote, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  ListOrdered
} from 'lucide-react';
import { ClinicalEngineOutput } from '../types';

interface SoapRecordViewProps {
  output: ClinicalEngineOutput;
  onSelectEvidence?: (tether: string) => void;
}

export const SoapRecordView: React.FC<SoapRecordViewProps> = ({ output }) => {
  const [copied, setCopied] = useState(false);
  const soap = output.soap_record;

  const copyAsPlainText = () => {
    const text = `
CLINICAL DOCUMENTATION (SOAP FORMAT)
Engine: neuro Agent Clinical Documentation & Reconciliation Engine
Patient: ${output.metadata.patient_demographics.name} (${output.metadata.patient_id})
Date: ${output.metadata.patient_demographics.encounter_date}

[SUBJECTIVE]
Chief Complaint: ${soap.subjective.chief_complaint}
Interval History: ${soap.subjective.interval_history}
Symptoms:
${soap.subjective.patient_reported_symptoms.map(s => `- ${s.symptom} (${s.reported_duration_or_severity}) [Quote: "${s.source_quote}"]`).join('\n')}
Adherence:
${soap.subjective.adherence_statements.map(a => `- ${a.medication_or_lifestyle}: ${a.adherence_status} - "${a.patient_statement}"`).join('\n')}

[OBJECTIVE]
Vitals:
${soap.objective.vitals.map(v => `- ${v.metric}: ${v.value} (${v.timestamp})`).join('\n')}
Active Conditions:
${soap.objective.baseline_active_conditions.map(c => `- ${c.condition}`).join('\n')}
Laboratory Findings:
${soap.objective.laboratory_findings.map(l => `- ${l.test_name}: ${l.value} ${l.unit} [${l.flag}] (Ref: ${l.reference_interval})`).join('\n')}

[ASSESSMENT SUMMARY]
${soap.assessment_summary.factual_synthesis}
Discrepancies Detected: ${soap.assessment_summary.clinical_discrepancies_detected_count}
Guardrail Statement: ${soap.assessment_summary.guardrail_statement}

[PLAN]
Follow-Up Schedule:
${soap.plan.follow_up_schedule.map(f => `- ${f.timeframe}: ${f.objective_or_clinic} (${f.rationale_documentation_only})`).join('\n')}
Monitoring Timelines:
${soap.plan.monitoring_timelines.map(m => `- ${m.parameter_to_monitor} (${m.frequency}) [Guideline: ${m.tethered_guideline_or_lab}]`).join('\n')}
Physician Verification Checkpoints:
${soap.plan.physician_verification_checkpoints.map(c => `- [ ] ${c}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header bar with meta and copy action */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-teal-50 text-teal-800 border border-teal-200/80">
              AUDITED CLINICAL RECORD
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Encounter: {output.metadata.encounter_id}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Structured SOAP Synthesis &amp; Documentation
          </h2>
        </div>

        <button
          onClick={copyAsPlainText}
          className="inline-flex items-center self-start sm:self-auto px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Copied to Clipboard
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
              Copy Clean SOAP Note
            </>
          )}
        </button>
      </div>

      {/* SECTION S: SUBJECTIVE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="bg-slate-50/70 px-5 py-4 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              S
            </span>
            <h3 className="text-sm font-bold text-slate-800">
              Subjective (Patient-Reported Dialogue &amp; Adherence)
            </h3>
          </div>
          <span className="text-xs text-slate-500">Source: Consultation Transcript</span>
        </div>

        <div className="p-5 sm:p-6 space-y-5 text-xs">
          {/* Chief Complaint */}
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-1.5">
              Chief Complaint:
            </div>
            <p className="text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed font-semibold text-sm">
              {soap.subjective.chief_complaint}
            </p>
          </div>

          {/* Interval History */}
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-1.5">
              Interval Clinical History:
            </div>
            <p className="text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed text-xs">
              {soap.subjective.interval_history}
            </p>
          </div>

          {/* Reported Symptoms */}
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2.5">
              Patient-Reported Symptoms &amp; Transcript Quotations:
            </div>
            <div className="space-y-2.5">
              {soap.subjective.patient_reported_symptoms.map((sym, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">{sym.symptom}</span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                      {sym.evidence_tether}
                    </span>
                  </div>
                  <div className="text-slate-600 text-xs">
                    <span className="text-slate-400">Duration/Severity: </span>
                    {sym.reported_duration_or_severity}
                  </div>
                  <div className="flex items-start text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <Quote className="w-3.5 h-3.5 mr-1.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>&ldquo;{sym.source_quote}&rdquo;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adherence Statements */}
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2.5">
              Medication &amp; Regimen Adherence Statements:
            </div>
            <div className="space-y-2.5">
              {soap.subjective.adherence_statements.map((adh, idx) => {
                const isNonAdherent = adh.adherence_status === 'Non-Adherent';
                const isDoseAltered = adh.adherence_status === 'Dose_Altered';
                return (
                  <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{adh.medication_or_lifestyle}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isNonAdherent
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : isDoseAltered
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {adh.adherence_status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs">{adh.patient_statement}</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Anchor: {adh.evidence_tether}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION O: OBJECTIVE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="bg-slate-50/70 px-5 py-4 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              O
            </span>
            <h3 className="text-sm font-bold text-slate-800">
              Objective (Vitals, Active EHR Baselines &amp; Timestamped Labs)
            </h3>
          </div>
          <span className="text-xs text-slate-500">Source: Verified Diagnostic Interface &amp; EHR</span>
        </div>

        <div className="p-5 sm:p-6 space-y-5 text-xs">
          {/* Encounter Vitals */}
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2.5">
              Physical &amp; Physiological Vitals:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {soap.objective.vitals.map((vit, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">{vit.metric}</div>
                  <div className="text-base font-bold text-slate-800 mt-1">{vit.value}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{vit.timestamp}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Conditions Baseline */}
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2.5">
              Historical Active Conditions (ICD-10 Baseline):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {soap.objective.baseline_active_conditions.map((cond, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <span className="text-slate-800 font-semibold">{cond.condition}</span>
                  <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    EHR Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Laboratory Findings */}
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2.5">
              Laboratory Findings with Reference Intervals &amp; Abnormal Flags:
            </div>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                    <th className="py-2.5 px-3 font-semibold">Test Name</th>
                    <th className="py-2.5 px-3 font-semibold">Value</th>
                    <th className="py-2.5 px-3 font-semibold">Reference</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {soap.objective.laboratory_findings.map((lab, idx) => {
                    const isHigh = lab.flag === 'HIGH' || lab.flag === 'CRITICAL_HIGH';
                    const isLow = lab.flag === 'LOW' || lab.flag === 'CRITICAL_LOW';
                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {lab.test_name}
                          <span className="block text-[10px] text-slate-400 font-mono">{lab.panel_name}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold">
                          <span className={isHigh ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-emerald-600'}>
                            {lab.value} {lab.unit}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500 text-xs">
                          {lab.reference_interval}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                            isHigh
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {lab.flag}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[10px] text-slate-500 font-mono">
                          {lab.timestamp}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION A: ASSESSMENT SUMMARY */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="bg-slate-50/70 px-5 py-4 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              A
            </span>
            <h3 className="text-sm font-bold text-slate-800">
              Assessment Summary (Factual Non-Prescriptive Synthesis)
            </h3>
          </div>
          <span className="text-xs text-amber-700 font-medium flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Non-Diagnostic Guardrail Enforced
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-5 text-xs">
          {/* Factual Synthesis */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed text-slate-800 font-medium text-sm">
            {soap.assessment_summary.factual_synthesis}
          </div>

          {/* Detected Safety Alerts */}
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2.5 flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
              Detected Clinical Discrepancies ({soap.assessment_summary.clinical_discrepancies_detected_count}):
            </div>
            <div className="space-y-2">
              {soap.assessment_summary.safety_alerts_summary.map((alert, idx) => (
                <div key={idx} className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 text-xs font-medium">
                  {alert}
                </div>
              ))}
            </div>
          </div>

          {/* Guardrail Statement */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 font-mono">
            {soap.assessment_summary.guardrail_statement}
          </div>
        </div>
      </div>

      {/* SECTION P: PLAN */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="bg-slate-50/70 px-5 py-4 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              P
            </span>
            <h3 className="text-sm font-bold text-slate-800">
              Plan (Explicit Follow-Up, Monitoring Timelines &amp; Verification Checkpoints)
            </h3>
          </div>
          <span className="text-xs text-slate-500">Physician Review Required</span>
        </div>

        <div className="p-5 sm:p-6 space-y-5 text-xs">
          {/* Follow-up schedule */}
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2.5 flex items-center">
              <Calendar className="w-3.5 h-3.5 text-teal-600 mr-1.5" />
              Explicit Follow-Up Schedule:
            </div>
            <div className="space-y-2">
              {soap.plan.follow_up_schedule.map((item, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800 text-xs">{item.objective_or_clinic}</span>
                    <p className="text-slate-600 text-xs mt-0.5">{item.rationale_documentation_only}</p>
                  </div>
                  <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 whitespace-nowrap self-start sm:self-auto">
                    {item.timeframe}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monitoring timelines */}
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2.5 flex items-center">
              <Clock className="w-3.5 h-3.5 text-cyan-600 mr-1.5" />
              Monitoring Timelines &amp; Clinical Parameters:
            </div>
            <div className="space-y-2">
              {soap.plan.monitoring_timelines.map((item, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800 text-xs">{item.parameter_to_monitor}</span>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Guideline Tether: {item.tethered_guideline_or_lab}
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
                    {item.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Physician Verification Checkpoints */}
          <div>
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[11px] mb-2.5 flex items-center">
              <ListOrdered className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
              Physician Verification Checkpoints:
            </div>
            <div className="space-y-2">
              {soap.plan.physician_verification_checkpoints.map((chk, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start space-x-2.5 text-slate-800">
                  <input
                    type="checkbox"
                    id={`checkpoint-${idx}`}
                    defaultChecked={false}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor={`checkpoint-${idx}`} className="cursor-pointer text-xs leading-relaxed font-medium">
                    {chk}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
