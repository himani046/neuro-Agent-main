import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  UserCheck, 
  UserPlus, 
  Database, 
  Loader2, 
  Check, 
  AlertCircle,
  Calendar,
  X
} from 'lucide-react';
import { ClinicalCaseInput } from '../types';

interface PatientSearchBarProps {
  cases: ClinicalCaseInput[];
  selectedCaseId: string;
  onSelectPatient: (patient: ClinicalCaseInput) => void;
  onCreateNewPatient: (patientName: string) => Promise<ClinicalCaseInput | null>;
  isLoading: boolean;
}

export const PatientSearchBar: React.FC<PatientSearchBarProps> = ({
  cases,
  selectedCaseId,
  onSelectPatient,
  onCreateNewPatient,
  isLoading
}) => {
  const currentPatient = cases.find(c => c.case_id === selectedCaseId) || cases[0];
  const [searchTerm, setSearchTerm] = useState(currentPatient ? currentPatient.patient_name : '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Update input when selected case changes externally
  useEffect(() => {
    if (currentPatient && !isDropdownOpen) {
      setSearchTerm(currentPatient.patient_name);
    }
  }, [selectedCaseId, currentPatient]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter existing patients in the database
  const matchingPatients = cases.filter(c => 
    c.patient_name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    c.patient_id.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const exactMatch = cases.find(
    c => c.patient_name.toLowerCase() === searchTerm.toLowerCase().trim()
  );

  // Handle typing in patient name
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsDropdownOpen(true);

    // Auto-fetch if exact match is typed
    const trimmed = val.trim().toLowerCase();
    if (trimmed.length > 2) {
      const directMatch = cases.find(c => c.patient_name.toLowerCase() === trimmed);
      if (directMatch && directMatch.case_id !== selectedCaseId) {
        onSelectPatient(directMatch);
        setFeedbackMessage(`Loaded record for ${directMatch.patient_name} (${directMatch.patient_id})`);
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    }
  };

  // Select an existing patient from database
  const handleSelect = (patient: ClinicalCaseInput) => {
    setSearchTerm(patient.patient_name);
    setIsDropdownOpen(false);
    onSelectPatient(patient);
    setFeedbackMessage(`Loaded: ${patient.patient_name} (${patient.patient_id})`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Create new patient database record
  const handleCreate = async () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setIsCreating(true);
    try {
      const newPatient = await onCreateNewPatient(trimmed);
      if (newPatient) {
        setSearchTerm(newPatient.patient_name);
        setIsDropdownOpen(false);
        setFeedbackMessage(`Created new patient profile for ${newPatient.patient_name} (${newPatient.patient_id})`);
        setTimeout(() => setFeedbackMessage(null), 4000);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (exactMatch) {
        handleSelect(exactMatch);
      } else if (matchingPatients.length === 1) {
        handleSelect(matchingPatients[0]);
      } else if (searchTerm.trim().length > 1) {
        handleCreate();
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div ref={searchContainerRef} className="relative flex-1 max-w-xl w-full">
      <div className="flex items-center bg-slate-50 border border-slate-250 focus-within:border-teal-600 focus-within:bg-white rounded-full transition-all shadow-xs px-1">
        <div className="pl-3 text-slate-400 flex items-center">
          <Search className="w-4 h-4 text-teal-600" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Doctor, search patient name or type new name to auto-create..."
          className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setIsDropdownOpen(true);
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <div className="pr-1 flex items-center">
          {isCreating || isLoading ? (
            <Loader2 className="w-4 h-4 text-teal-600 animate-spin mr-2" />
          ) : exactMatch ? (
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full mr-1">
              <Check className="w-3 h-3 mr-1 text-emerald-600" />
              Verified
            </span>
          ) : (
            <button
              type="button"
              onClick={handleCreate}
              disabled={!searchTerm.trim() || isCreating}
              className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
              title="Create new patient database record"
            >
              <UserPlus className="w-3 h-3 mr-1" />
              Auto-Create
            </button>
          )}
        </div>
      </div>

      {/* Floating Instant Feedback Notice */}
      {feedbackMessage && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-teal-200 rounded-2xl p-2.5 text-xs text-teal-800 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-medium">{feedbackMessage}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">neuro Agent DB Synced</span>
        </div>
      )}

      {/* Dropdown for Patient Autocomplete & Creation */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-80 overflow-y-auto">
          {/* Header info */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center font-medium">
              <Database className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Patient Records Database ({cases.length})
            </span>
            <span className="text-slate-400">Press Enter to select or create</span>
          </div>

          {/* Matched Patients in Database */}
          {matchingPatients.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {matchingPatients.map(patient => (
                <button
                  key={patient.case_id}
                  type="button"
                  onClick={() => handleSelect(patient)}
                  className={`w-full text-left p-3 hover:bg-teal-50/50 transition-colors flex items-center justify-between ${
                    patient.case_id === selectedCaseId ? 'bg-teal-50/80 border-l-4 border-teal-600' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-slate-800">
                        {patient.patient_name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {patient.patient_id}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {patient.patient_age}y • {patient.patient_gender}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {patient.case_title}
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="text-[10px] text-slate-400 flex items-center justify-end">
                      <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                      {patient.encounter_date}
                    </span>
                    <span className="text-[11px] text-teal-600 font-medium">Load Record &rarr;</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500 text-xs">
              No matching patient found for &ldquo;<span className="text-slate-800 font-medium">{searchTerm}</span>&rdquo;
            </div>
          )}

          {/* If patient is not exact match or not in database, offer instant database creation */}
          {!exactMatch && searchTerm.trim().length > 0 && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
              <div className="text-xs text-slate-600 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 text-amber-500 mr-1.5 shrink-0" />
                <span>Patient not found in system. Create a new patient profile?</span>
              </div>
              <button
                type="button"
                onClick={handleCreate}
                disabled={isCreating}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating Patient Record...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Database Entry for &ldquo;{searchTerm.trim()}&rdquo;</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
