/**
 * Autonomous Clinical Documentation & Reconciliation Engine
 * Engineered by Team Dynamic coder
 * Strict Regulatory & Safety Schema Definitions
 */

export type RoleAssignment = 
  | 'Attending_Physician'
  | 'Care_Coordinator'
  | 'Laboratory'
  | 'Pharmacy';

export type UrgencyTier = 'Routine' | 'Priority' | 'Urgent';

export type ConflictType = 
  | 'Dosage_Mismatch'
  | 'Allergy_Cross_Reactivity'
  | 'Objective_Lab_Deviation_Correlation'
  | 'Adherence_Gap'
  | 'Other_Contradiction';

export type LabFlag = 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL_HIGH' | 'CRITICAL_LOW';

export interface VitalsRecord {
  metric: string;
  value: string;
  unit?: string;
  reference_interval?: string;
  status?: 'Normal' | 'Elevated' | 'Low' | 'Critical';
  timestamp: string;
  source: string;
}

export interface BaselineCondition {
  condition: string;
  icd10_code?: string;
  documented_in_ehr: boolean;
  evidence_tether: string;
}

export interface LabFinding {
  panel_name: string;
  test_name: string;
  value: string;
  unit: string;
  reference_interval: string;
  flag: LabFlag;
  timestamp: string;
  source: string;
}

export interface PatientReportedSymptom {
  symptom: string;
  reported_duration_or_severity: string;
  source_quote: string;
  evidence_tether: string;
}

export interface AdherenceStatement {
  medication_or_lifestyle: string;
  patient_statement: string;
  adherence_status: 'Adherent' | 'Non-Adherent' | 'Partial' | 'Dose_Altered';
  evidence_tether: string;
}

export interface FollowUpScheduleItem {
  timeframe: string;
  objective_or_clinic: string;
  rationale_documentation_only: string;
}

export interface MonitoringTimelineItem {
  parameter_to_monitor: string;
  frequency: string;
  tethered_guideline_or_lab: string;
}

export interface ConflictMatrixItem {
  conflict_id: string;
  conflict_type: ConflictType;
  severity: UrgencyTier;
  requires_human_escalation: true; // Strict zero-tolerance guardrail
  discrepancy_description: string;
  sources_involved: {
    subjective_transcript?: string;
    historical_ehr?: string;
    laboratory_panel?: string;
    clinical_guideline_rag?: string;
  };
  clinical_risk_assessment_non_prescriptive: string;
  recommended_escalation_target: RoleAssignment;
}

export interface ActionItem {
  action_id: string;
  assigned_role: RoleAssignment;
  urgency_tier: UrgencyTier;
  task_description: string;
  rationale_and_evidence: string;
  requires_physician_signoff: boolean;
}

export interface AuditLedgerItem {
  claim_id: string;
  claim_text: string;
  evidence_source_type: 'Transcript' | 'EHR_Record' | 'Laboratory_Panel' | 'Clinical_Guideline';
  exact_source_anchor: string;
  verification_status: 'Verified_Tethered' | 'Discrepancy_Escalated';
}

export interface RegulatoryCompliance {
  is_strictly_non_diagnostic: boolean;
  is_strictly_non_prescriptive: boolean;
  all_claims_grounded: boolean;
  zero_tolerance_guardrails_passed: boolean;
  synthetic_boundary_verified: boolean;
}

export interface SoapRecord {
  subjective: {
    chief_complaint: string;
    patient_reported_symptoms: PatientReportedSymptom[];
    interval_history: string;
    adherence_statements: AdherenceStatement[];
  };
  objective: {
    vitals: VitalsRecord[];
    baseline_active_conditions: BaselineCondition[];
    laboratory_findings: LabFinding[];
  };
  assessment_summary: {
    factual_synthesis: string;
    clinical_discrepancies_detected_count: number;
    safety_alerts_summary: string[];
    guardrail_statement: string;
  };
  plan: {
    follow_up_schedule: FollowUpScheduleItem[];
    monitoring_timelines: MonitoringTimelineItem[];
    physician_verification_checkpoints: string[];
  };
}

export interface ClinicalEngineOutput {
  metadata: {
    engine_name: string;
    team: 'Team Dynamic coder';
    timestamp: string;
    encounter_id: string;
    patient_id: string;
    patient_demographics: {
      name: string;
      age: number;
      gender: string;
      encounter_date: string;
    };
    regulatory_compliance: RegulatoryCompliance;
  };
  soap_record: SoapRecord;
  conflict_matrix: ConflictMatrixItem[];
  action_items: ActionItem[];
  audit_and_evidence_ledger: AuditLedgerItem[];
}

export interface ClinicalCaseInput {
  case_id: string;
  case_title: string;
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  encounter_date: string;
  transcript: string;
  ehr_records: {
    active_problems: string[];
    documented_medications: Array<{
      drug: string;
      dosage: string;
      frequency: string;
      route: string;
      last_refill: string;
    }>;
    allergies: Array<{
      allergen: string;
      reaction: string;
      severity: string;
    }>;
    recent_vitals: Array<{
      metric: string;
      value: string;
      timestamp: string;
    }>;
  };
  lab_panels: Array<{
    panel_name: string;
    test_name: string;
    value: string;
    unit: string;
    reference_interval: string;
    flag: LabFlag;
    timestamp: string;
  }>;
  clinical_guidelines_rag: Array<{
    guideline_id: string;
    source: string;
    topic: string;
    guideline_text: string;
  }>;
}

export interface DoctorChatMessage {
  id: string;
  sender: 'doctor' | 'user';
  text: string;
  timestamp: string;
  isStandardQuestion?: boolean;
  standardQuestionLabel?: string;
  referencedLabs?: string[];
  referencedMeds?: string[];
}
