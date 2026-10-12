import { ClinicalCaseInput } from '../types';

export const BENCHMARK_CLINICAL_CASES: ClinicalCaseInput[] = [
  {
    case_id: 'CASE-01-HYPERKALEMIA-DISCREPANCY',
    case_title: 'Case 1: Polypharmacy Discrepancy, Hyperkalemia & Statin Adherence Gap',
    patient_id: 'SYN-PT-4091',
    patient_name: 'Gautam Kashyap',
    patient_age: 20,
    patient_gender: 'Male',
    encounter_date: '2026-09-12',
    transcript: `[00:01] Dr. Meredith Reed: Good morning, Mr. Kashyap. Thanks for coming in today. How have you been feeling since our last visit two months ago?
[00:10] Gautam Kashyap: Well, Dr. Reed, my knees have been stiff, but mainly I've been feeling a bit sluggish. And my home blood pressure was running in the 150s over 90 last week.
[00:23] Dr. Meredith Reed: I see. Are you still taking your blood pressure medication as written? The chart shows Lisinopril 10 mg once daily.
[00:32] Gautam Kashyap: Ah, about that. Since the home monitor was showing 154/92, my family looked at my pill bottle and told me I should take two of the 10 mg tablets every morning. So I've been taking 20 mg every day for the past three weeks.
[00:49] Dr. Meredith Reed: Okay, you've doubled the Lisinopril dose on your own. How about your cholesterol medication, Atorvastatin 40 mg?
[01:00] Gautam Kashyap: To be honest with you, Doctor, I completely stopped taking the statin pills about three or four weeks back. Every night my calves were cramping up so bad I couldn't sleep, and my thigh muscles felt like I had run a marathon. Once I stopped the statin, the soreness eased up.
[01:21] Dr. Meredith Reed: That's very important to note. Did you take any other pills or supplements?
[01:27] Gautam Kashyap: I had a painful toothache last weekend. My neighbor had some leftover amoxicillin capsules and offered them to me, but I held off because I remember I had an allergic reaction years ago.
[01:41] Dr. Meredith Reed: Good thing you didn't take it! Your chart flags a severe penicillin allergy with throat tightness and hives. Amoxicillin is in the penicillin family and could have triggered severe anaphylaxis.
[01:56] Gautam Kashyap: Glad I checked. Also, I got the blood draw done at the outpatient lab on Thursday morning like your nurse instructed.
[02:05] Dr. Meredith Reed: Perfect, I see the comprehensive metabolic panel results just landed in the portal. Let's look over those numbers together and arrange the next steps.`,
    ehr_records: {
      active_problems: [
        'Essential (primary) hypertension (ICD-10 I10)',
        'Chronic kidney disease, stage 3a (ICD-10 N18.31)',
        'Hyperlipidemia, unspecified (ICD-10 E78.5)',
        'Type 2 diabetes mellitus without complications (ICD-10 E11.9)'
      ],
      documented_medications: [
        {
          drug: 'Lisinopril',
          dosage: '10 mg',
          frequency: 'PO once daily',
          route: 'Oral',
          last_refill: '2026-08-15'
        },
        {
          drug: 'Atorvastatin calcium',
          dosage: '40 mg',
          frequency: 'PO once daily at bedtime',
          route: 'Oral',
          last_refill: '2026-07-28'
        },
        {
          drug: 'Metformin HCl',
          dosage: '500 mg',
          frequency: 'PO twice daily with meals',
          route: 'Oral',
          last_refill: '2026-08-20'
        }
      ],
      allergies: [
        {
          allergen: 'Penicillin class',
          reaction: 'Anaphylaxis / Pharyngeal Angioedema & Urticaria',
          severity: 'Critical / Life-Threatening'
        }
      ],
      recent_vitals: [
        { metric: 'Blood Pressure', value: '148/88 mmHg', timestamp: '2026-09-12 09:15' },
        { metric: 'Heart Rate', value: '72 bpm', timestamp: '2026-09-12 09:15' },
        { metric: 'Respiratory Rate', value: '16 breaths/min', timestamp: '2026-09-12 09:15' },
        { metric: 'Body Mass Index', value: '28.4 kg/m²', timestamp: '2026-09-12 09:15' }
      ]
    },
    lab_panels: [
      {
        panel_name: 'Comprehensive Metabolic Panel (CMP)',
        test_name: 'Serum Potassium (K+)',
        value: '5.4',
        unit: 'mEq/L',
        reference_interval: '3.5 - 5.0',
        flag: 'HIGH',
        timestamp: '2026-09-10 08:30'
      },
      {
        panel_name: 'Comprehensive Metabolic Panel (CMP)',
        test_name: 'Serum Creatinine',
        value: '1.62',
        unit: 'mg/dL',
        reference_interval: '0.70 - 1.30',
        flag: 'HIGH',
        timestamp: '2026-09-10 08:30'
      },
      {
        panel_name: 'Renal Function Profile',
        test_name: 'Estimated GFR (CKD-EPI)',
        value: '44',
        unit: 'mL/min/1.73m²',
        reference_interval: '> 60',
        flag: 'LOW',
        timestamp: '2026-09-10 08:30'
      },
      {
        panel_name: 'Comprehensive Metabolic Panel (CMP)',
        test_name: 'Blood Urea Nitrogen (BUN)',
        value: '29',
        unit: 'mg/dL',
        reference_interval: '7 - 20',
        flag: 'HIGH',
        timestamp: '2026-09-10 08:30'
      },
      {
        panel_name: 'Lipid Panel',
        test_name: 'Total Cholesterol',
        value: '246',
        unit: 'mg/dL',
        reference_interval: '< 200',
        flag: 'HIGH',
        timestamp: '2026-09-10 08:30'
      },
      {
        panel_name: 'Lipid Panel',
        test_name: 'Low-Density Lipoprotein (LDL-C)',
        value: '164',
        unit: 'mg/dL',
        reference_interval: '< 100',
        flag: 'HIGH',
        timestamp: '2026-09-10 08:30'
      },
      {
        panel_name: 'Glycemic Assessment',
        test_name: 'Hemoglobin A1c',
        value: '6.8',
        unit: '%',
        reference_interval: '4.0 - 5.6',
        flag: 'HIGH',
        timestamp: '2026-09-10 08:30'
      }
    ],
    clinical_guidelines_rag: [
      {
        guideline_id: 'KDIGO-CKD-2024-K-ACEI',
        source: 'KDIGO Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease',
        topic: 'ACE Inhibitor Dosing and Hyperkalemia Management',
        guideline_text: 'In patients with CKD Stage 3+ receiving RAAS inhibitors (e.g., Lisinopril), serum potassium exceeding 5.0 mEq/L mandates prompt physician review. Unsanctioned dose escalation markedly compounds risk of severe hyperkalemia (> 5.5 mEq/L) and cardiac dysrhythmias. Electrolytes should be rechecked within 7-14 days following any dose adjustment.'
      },
      {
        guideline_id: 'ACC-AHA-2023-STATIN-SAMS',
        source: 'ACC/AHA Guideline on the Management of Blood Cholesterol',
        topic: 'Statin-Associated Muscle Symptoms (SAMS) & Discontinuation',
        guideline_text: 'When patients experience bilateral myalgia, cramps, or weakness following statin therapy, clinicians must evaluate creatine kinase (CK) levels, rule out drug interactions, and document cessation. Abrupt discontinuation without clinical reconciliation elevates cardiovascular event risk; alternative statin regimens or ezetimibe non-statin therapy should be evaluated by the physician.'
      },
      {
        guideline_id: 'AAAAI-DRUG-ALLERGY-BETALACTAM',
        source: 'American Academy of Allergy, Asthma & Immunology Practice Parameter',
        topic: 'Beta-Lactam Cross-Reactivity Guardrail',
        guideline_text: 'Patients with a documented history of IgE-mediated anaphylaxis to Penicillin are strictly contraindicated from receiving aminopenicillins (Amoxicillin, Ampicillin) due to high cross-reactivity (>30-40% based on identical beta-lactam core). Explicit allergy cross-checking must occur before any antibiotic dispensing.'
      }
    ]
  },
  {
    case_id: 'CASE-02-NEPHROPATHY-NSAID-GAP',
    case_title: 'Case 2: Diabetic Nephropathy & Unmonitored OTC NSAID Nephrotoxicity',
    patient_id: 'SYN-PT-5284',
    patient_name: 'Himani Parmar',
    patient_age: 19,
    patient_gender: 'Female',
    encounter_date: '2026-09-11',
    transcript: `[00:02] Dr. Andrew Patel: Hello Ms. Parmar, it is good to see you. How have your blood sugars and overall comfort been lately?
[00:11] Himani Parmar: Hello Dr. Patel. My right knee osteoarthritis has been flaring up terribly for the last four weeks. I could barely walk down the stairs.
[00:22] Dr. Andrew Patel: I'm sorry to hear that. What have you been using to control the knee pain?
[00:28] Himani Parmar: I bought the big economy bottle of OTC Ibuprofen 200 mg at the store. To get any relief, I've been taking four tablets three times every day—so about 800 mg three times a day, roughly 2,400 mg daily for the past month.
[00:46] Dr. Andrew Patel: That is a high continuous dose of an anti-inflammatory, especially with your kidney history. And how has your diabetes regimen been going? The EHR lists Metformin 1,000 mg twice daily.
[00:59] Himani Parmar: Well, the Metformin causes so much nausea and loose stools that I cut back on my own. I only take it maybe twice a week when I eat a heavy meal, instead of every day.
[01:14] Dr. Andrew Patel: Understood. You've had reduced adherence on the Metformin due to GI distress, while taking 2,400 mg daily of Ibuprofen. Let's look at the bloodwork drawn yesterday at the clinic lab.`,
    ehr_records: {
      active_problems: [
        'Type 2 diabetes mellitus with diabetic nephropathy (ICD-10 E11.21)',
        'Chronic kidney disease, stage 3a baseline (ICD-10 N18.30)',
        'Primary osteoarthritis, right knee (ICD-10 M17.11)'
      ],
      documented_medications: [
        {
          drug: 'Metformin HCl',
          dosage: '1000 mg',
          frequency: 'PO twice daily with breakfast and dinner',
          route: 'Oral',
          last_refill: '2026-07-15'
        },
        {
          drug: 'Losartan potassium',
          dosage: '50 mg',
          frequency: 'PO once daily',
          route: 'Oral',
          last_refill: '2026-08-10'
        }
      ],
      allergies: [
        {
          allergen: 'Sulfa (Sulfonamides)',
          reaction: 'Maculopapular rash and pruritus',
          severity: 'Moderate'
        }
      ],
      recent_vitals: [
        { metric: 'Blood Pressure', value: '142/86 mmHg', timestamp: '2026-09-11 10:05' },
        { metric: 'Heart Rate', value: '78 bpm', timestamp: '2026-09-11 10:05' },
        { metric: 'Weight', value: '76.2 kg', timestamp: '2026-09-11 10:05' }
      ]
    },
    lab_panels: [
      {
        panel_name: 'Renal Function Profile',
        test_name: 'Estimated GFR (CKD-EPI)',
        value: '36',
        unit: 'mL/min/1.73m²',
        reference_interval: '> 60',
        flag: 'LOW',
        timestamp: '2026-09-10 14:15'
      },
      {
        panel_name: 'Comprehensive Metabolic Panel (CMP)',
        test_name: 'Serum Creatinine',
        value: '1.88',
        unit: 'mg/dL',
        reference_interval: '0.50 - 1.10',
        flag: 'CRITICAL_HIGH',
        timestamp: '2026-09-10 14:15'
      },
      {
        panel_name: 'Comprehensive Metabolic Panel (CMP)',
        test_name: 'Blood Urea Nitrogen (BUN)',
        value: '34',
        unit: 'mg/dL',
        reference_interval: '7 - 20',
        flag: 'HIGH',
        timestamp: '2026-09-10 14:15'
      },
      {
        panel_name: 'Glycemic Panel',
        test_name: 'Hemoglobin A1c',
        value: '9.4',
        unit: '%',
        reference_interval: '4.0 - 5.6',
        flag: 'HIGH',
        timestamp: '2026-09-10 14:15'
      },
      {
        panel_name: 'Urinalysis',
        test_name: 'Urine Albumin-to-Creatinine Ratio (UACR)',
        value: '380',
        unit: 'mg/g',
        reference_interval: '< 30',
        flag: 'HIGH',
        timestamp: '2026-09-10 14:15'
      }
    ],
    clinical_guidelines_rag: [
      {
        guideline_id: 'KDIGO-AKI-NSAID-TRIPLE-WHAMMY',
        source: 'KDIGO Clinical Practice Guideline for Acute Kidney Injury',
        topic: 'NSAID Induced Hemodynamic AKI in CKD',
        guideline_text: 'High-dose systemic nonsteroidal anti-inflammatory drugs (NSAIDs, e.g., Ibuprofen ≥ 2400 mg/day) inhibit renal prostaglandins and cause afferent arteriolar vasoconstriction. In patients receiving concurrent ARBs (Losartan) with pre-existing CKD, this precipitously accelerates acute-on-chronic renal injury. Avoid prolonged NSAID therapy; physician escalation required.'
      },
      {
        guideline_id: 'ADA-2026-METFORMIN-EGFR',
        source: 'American Diabetes Association Standards of Care in Diabetes',
        topic: 'Metformin Dosing Constraints by eGFR',
        guideline_text: 'Metformin initiation is contraindicated with eGFR < 30 mL/min. For eGFR between 30 and 44 mL/min, maximum recommended dose is 1,000 mg/day with close renal function surveillance due to risk of lactic acidosis. Frequent patient skipping requires care-coordinator evaluation and provider review.'
      }
    ]
  },
  {
    case_id: 'CASE-03-ANTICOAGULATION-WARFARIN-DOAC',
    case_title: 'Case 3: Atrial Fibrillation Anticoagulation Cross-System Transition Inconsistency',
    patient_id: 'SYN-PT-7102',
    patient_name: 'Aditya Kashyap',
    patient_age: 25,
    patient_gender: 'Male',
    encounter_date: '2026-09-09',
    transcript: `[00:03] Dr. Sarah Lin: Good afternoon Mr. Kashyap. We are reviewing your cardiac records today following your outside electrophysiologist visit last month.
[00:13] Aditya Kashyap: Yes, Dr. Lin. The cardiologist at the regional hospital told me they wanted me on a newer blood thinner. He handed me a starter pack of Eliquis—Apixaban 5 mg twice a day.
[00:27] Dr. Sarah Lin: You started Apixaban 5 mg twice daily? Our outpatient EHR still documents you on Warfarin sodium 4 mg daily with monthly INR blood draws. Have you still been taking the Warfarin?
[00:40] Aditya Kashyap: No, I stopped the Warfarin two weeks ago when I started the Eliquis sample box. But nobody in the hospital communicated that to my regular pharmacy, so the pharmacy just mailed me another 90-day bottle of Warfarin.
[00:57] Dr. Sarah Lin: It is critical we clarify that immediately. Taking both would cause dangerous hemorrhage. Are you taking any other over-the-counter supplements or herbal remedies?
[01:08] Aditya Kashyap: My sister brought me St. John's Wort herbal capsules for low mood, and I drink concentrated cranberry extract daily.
[01:21] Dr. Sarah Lin: Thank you for telling me. We have your coagulation panel and CBC drawn yesterday. Let's make sure our documentation reconciles this transition across systems.`,
    ehr_records: {
      active_problems: [
        'Nonvalvular atrial fibrillation (ICD-10 I48.0)',
        'History of deep vein thrombosis (ICD-10 Z86.718)',
        'Mild cognitive impairment (ICD-10 G31.84)'
      ],
      documented_medications: [
        {
          drug: 'Warfarin sodium',
          dosage: '4 mg',
          frequency: 'PO once daily in evening',
          route: 'Oral',
          last_refill: '2026-08-28'
        },
        {
          drug: 'Metoprolol succinate ER',
          dosage: '50 mg',
          frequency: 'PO once daily',
          route: 'Oral',
          last_refill: '2026-08-15'
        }
      ],
      allergies: [
        {
          allergen: 'Codeine',
          reaction: 'Severe nausea and bronchospasm',
          severity: 'Severe'
        }
      ],
      recent_vitals: [
        { metric: 'Blood Pressure', value: '128/80 mmHg', timestamp: '2026-09-09 13:40' },
        { metric: 'Heart Rate', value: '68 bpm (Irregularly irregular)', timestamp: '2026-09-09 13:40' },
        { metric: 'SpO2', value: '97% on room air', timestamp: '2026-09-09 13:40' }
      ]
    },
    lab_panels: [
      {
        panel_name: 'Coagulation Panel',
        test_name: 'Prothrombin Time / INR',
        value: '1.2',
        unit: 'INR',
        reference_interval: '2.0 - 3.0 (Target for Warfarin in AFib)',
        flag: 'LOW',
        timestamp: '2026-09-08 11:00'
      },
      {
        panel_name: 'Complete Blood Count (CBC)',
        test_name: 'Hemoglobin',
        value: '13.9',
        unit: 'g/dL',
        reference_interval: '13.5 - 17.5',
        flag: 'NORMAL',
        timestamp: '2026-09-08 11:00'
      },
      {
        panel_name: 'Complete Blood Count (CBC)',
        test_name: 'Platelet Count',
        value: '228',
        unit: 'x10³/µL',
        reference_interval: '150 - 450',
        flag: 'NORMAL',
        timestamp: '2026-09-08 11:00'
      },
      {
        panel_name: 'Comprehensive Metabolic Panel (CMP)',
        test_name: 'Serum Creatinine',
        value: '1.05',
        unit: 'mg/dL',
        reference_interval: '0.70 - 1.30',
        flag: 'NORMAL',
        timestamp: '2026-09-08 11:00'
      }
    ],
    clinical_guidelines_rag: [
      {
        guideline_id: 'CHEST-ANTICOAG-TRANSITION',
        source: 'CHEST Guidelines and Expert Panel Report on Antithrombotic Therapy',
        topic: 'Oral Anticoagulant Cross-System Reconciliation',
        guideline_text: 'Transitioning from Vitamin K Antagonists (Warfarin) to DOACs (Apixaban) requires discontinuation of Warfarin and initiating DOAC once INR is < 2.0. Unreconciled dual dispensing from disparate care sites poses catastrophic bleed hazard. Active pharmacy cancellation of legacy orders is required.'
      },
      {
        guideline_id: 'FDA-HERBAL-INTERACTION-STJOHNS',
        source: 'FDA Clinical Pharmacology Herb-Drug Interaction Database',
        topic: 'St. John’s Wort P-gp / CYP3A4 Induction',
        guideline_text: 'St. John’s Wort is a potent inducer of intestinal P-glycoprotein (P-gp) and CYP3A4, which can significantly decrease plasma concentrations of Apixaban, potentially compromising stroke prevention efficacy in atrial fibrillation.'
      }
    ]
  }
];
