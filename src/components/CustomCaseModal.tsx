import React, { useState } from 'react';
import { X, Check, SlidersHorizontal, FileText, Database, TestTubes } from 'lucide-react';
import { ClinicalCaseInput } from '../types';

interface CustomCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCase: (newCase: ClinicalCaseInput) => void;
}

export const CustomCaseModal: React.FC<CustomCaseModalProps> = ({
  isOpen,
  onClose,
  onSubmitCase
}) => {
  if (!isOpen) return null;

  const [patientName, setPatientName] = useState('Eleanor Wright');
  const [patientId, setPatientId] = useState('SYN-PT-9821');
  const [patientAge, setPatientAge] = useState(65);
  const [patientGender, setPatientGender] = useState('Female');
  const [caseTitle, setCaseTitle] = useState('Custom Case: Polymedication & Acute Discrepancy');
  
  const [transcript, setTranscript] = useState(`[00:05] Dr. Jonathan Hayes: Good morning Mrs. Wright. Let's review your medications today.
[00:14] Eleanor Wright: Hello Doctor. I've been getting dizzy every time I stand up, especially in the afternoon.
[00:25] Dr. Jonathan Hayes: Are you taking your Carvedilol 12.5 mg twice a day as prescribed?
[00:33] Eleanor Wright: I was getting confused between the bottles, so I've actually been taking the 25 mg pills twice daily from an older prescription from last year.
[00:48] Dr. Jonathan Hayes: You've been taking double the intended dose. And how about your Furosemide diuretic?
[00:58] Eleanor Wright: I ran out of Furosemide two weeks ago and forgot to order the refill, so I haven't taken any for 14 days.
[01:10] Dr. Jonathan Hayes: That explains the ankle swelling and orthostatic symptoms. Let's examine your blood pressure and kidney labs.`);

  const [medsText, setMedsText] = useState(`Carvedilol 12.5 mg PO twice daily
Furosemide 40 mg PO once daily in morning
Lisinopril 10 mg PO once daily`);

  const [problemsText, setProblemsText] = useState(`Congestive Heart Failure, NYHA Class II (ICD-10 I50.22)
Essential Hypertension (ICD-10 I10)
Stage 2 Chronic Kidney Disease (ICD-10 N18.2)`);

  const [labsText, setLabsText] = useState(`Serum Potassium: 3.2 mEq/L (Ref: 3.5 - 5.0) [LOW]
Serum Creatinine: 1.45 mg/dL (Ref: 0.60 - 1.20) [HIGH]
eGFR: 52 mL/min (Ref: > 60) [LOW]
BNP: 420 pg/mL (Ref: < 100) [HIGH]`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const medications = medsText.split('\n').filter(l => l.trim()).map(line => ({
      drug: line.split(' ')[0] || 'Medication',
      dosage: line.split(' ')[1] || 'Standard',
      frequency: line.slice(line.indexOf('PO') !== -1 ? line.indexOf('PO') : 10) || 'Daily',
      route: 'Oral',
      last_refill: '2026-08-01'
    }));

    const labPanels = labsText.split('\n').filter(l => l.trim()).map((line, i) => {
      const parts = line.split(':');
      const testName = parts[0]?.trim() || `Test ${i + 1}`;
      const rest = parts[1] || '';
      const flagMatch = rest.match(/\[(HIGH|LOW|NORMAL|CRITICAL_HIGH|CRITICAL_LOW)\]/);
      const flag = (flagMatch ? flagMatch[1] : 'HIGH') as any;
      const valMatch = rest.match(/([0-9.]+)\s*([a-zA-Z/%³µ]+)?/);

      return {
        panel_name: 'Custom Diagnostic Panel',
        test_name: testName,
        value: valMatch ? valMatch[1] : '1.0',
        unit: valMatch && valMatch[2] ? valMatch[2] : 'unit',
        reference_interval: 'Standard Range',
        flag,
        timestamp: '2026-09-12 08:00'
      };
    });

    const newCase: ClinicalCaseInput = {
      case_id: `CUSTOM-${Date.now()}`,
      case_title: caseTitle,
      patient_id: patientId,
      patient_name: patientName,
      patient_age: Number(patientAge),
      patient_gender: patientGender,
      encounter_date: '2026-09-13',
      transcript,
      ehr_records: {
        active_problems: problemsText.split('\n').filter(l => l.trim()),
        documented_medications: medications,
        allergies: [
          {
            allergen: 'Codeine',
            reaction: 'Nausea and hives',
            severity: 'Moderate'
          }
        ],
        recent_vitals: [
          { metric: 'Blood Pressure', value: '104/62 mmHg', timestamp: '2026-09-13 09:30' },
          { metric: 'Heart Rate', value: '56 bpm', timestamp: '2026-09-13 09:30' }
        ]
      },
      lab_panels: labPanels,
      clinical_guidelines_rag: [
        {
          guideline_id: 'AHA-HF-GUIDELINE',
          source: 'AHA/ACC Guideline for the Management of Heart Failure',
          topic: 'Beta-Blocker Titration & Diuretic Compliance',
          guideline_text: 'Beta-blocker dose doubling combined with abrupt loop diuretic cessation poses acute risks of bradycardia, decompensated congestion, and electrolyte derangements.'
        }
      ]
    };

    onSubmitCase(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      {/* Modal Box */}
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Custom Clinical Ingestion Studio</h3>
              <p className="text-xs text-slate-500">
                Input simulated consultation dialogue and records to test reconciliation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1.5">Case Title</label>
              <input
                type="text"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Synthetic Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Synthetic ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Transcript Dialogue */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5 flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="w-3.5 h-3.5 text-teal-600 mr-1.5" />
                Simulated Consultation Dialogue (Transcript)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">[timestamp] Speaker: Dialogue</span>
            </label>
            <textarea
              rows={6}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-800 font-mono text-xs focus:outline-none focus:border-teal-500 focus:bg-white leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EHR Meds & Problems */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center">
                <Database className="w-3.5 h-3.5 text-sky-600 mr-1.5" />
                Documented EHR Medications (1 per line)
              </label>
              <textarea
                rows={3}
                value={medsText}
                onChange={(e) => setMedsText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                EHR Active Problems (1 per line)
              </label>
              <textarea
                rows={3}
                value={problemsText}
                onChange={(e) => setProblemsText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Lab Panels */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5 flex items-center">
              <TestTubes className="w-3.5 h-3.5 text-purple-600 mr-1.5" />
              Timestamped Lab Values (e.g. Test: Value Unit [FLAG])
            </label>
            <textarea
              rows={3}
              value={labsText}
              onChange={(e) => setLabsText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-150 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Load &amp; Ingest Custom Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
