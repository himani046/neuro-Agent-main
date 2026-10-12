import React, { useState } from 'react';
import { 
  Link2, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  FileText, 
  Database, 
  TestTubes, 
  BookOpen
} from 'lucide-react';
import { AuditLedgerItem } from '../types';

interface AuditLedgerViewProps {
  auditLedger: AuditLedgerItem[];
  onSelectEvidence?: (tether: string) => void;
}

export const AuditLedgerView: React.FC<AuditLedgerViewProps> = ({ auditLedger }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [sourceTypeFilter, setSourceTypeFilter] = useState('ALL');

  const filteredItems = auditLedger.filter(item => {
    const matchesSource = sourceTypeFilter === 'ALL' || item.evidence_source_type === sourceTypeFilter;
    const matchesQuery = !filterQuery || 
      item.claim_text.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.exact_source_anchor.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.claim_id.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesSource && matchesQuery;
  });

  const getSourceTypeBadge = (sourceType: string) => {
    switch (sourceType) {
      case 'Transcript':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 rounded-full">
            <FileText className="w-3 h-3 mr-1 text-teal-600" />
            Transcript
          </span>
        );
      case 'EHR_Record':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 rounded-full">
            <Database className="w-3 h-3 mr-1 text-sky-600" />
            EHR Record
          </span>
        );
      case 'Laboratory_Panel':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 rounded-full">
            <TestTubes className="w-3 h-3 mr-1 text-purple-600" />
            Lab Panel
          </span>
        );
      case 'Clinical_Guideline':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
            <BookOpen className="w-3 h-3 mr-1 text-amber-600" />
            Guideline
          </span>
        );
      default:
        return <span className="text-slate-500 text-xs">{sourceType}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 rounded-full">
                AUDIT LOG &amp; CHAIN OF CUSTODY
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {auditLedger.length} Verified Claims
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Evidence Grounding &amp; Claim Tethering Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero-tolerance regulatory check: Every documented assertion is mapped to an authoritative source anchor.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              aria-label="Filter ledger by source type"
              value={sourceTypeFilter}
              onChange={(e) => setSourceTypeFilter(e.target.value)}
              className="bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
            >
              <option value="ALL">All Evidence Sources</option>
              <option value="Transcript">Consultation Transcript</option>
              <option value="EHR_Record">Historical EHR Records</option>
              <option value="Laboratory_Panel">Laboratory Panels</option>
              <option value="Clinical_Guideline">Clinical Guidelines</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search claims, clinical assertions, or exact anchor citations..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-250 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                <th className="py-3 px-4 font-semibold w-24">Claim ID</th>
                <th className="py-3 px-4 font-semibold">Documented Claim / Clinical Statement</th>
                <th className="py-3 px-4 font-semibold w-36">Source Type</th>
                <th className="py-3 px-4 font-semibold">Exact Source Anchor Citation</th>
                <th className="py-3 px-4 font-semibold w-36">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, idx) => {
                const isEscalated = item.verification_status === 'Discrepancy_Escalated';
                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-800">
                      {item.claim_id}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-md">
                      {item.claim_text}
                    </td>

                    <td className="py-3.5 px-4">
                      {getSourceTypeBadge(item.evidence_source_type)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px] max-w-xs">
                      <div className="flex items-start">
                        <Link2 className="w-3.5 h-3.5 mr-1.5 text-teal-600 shrink-0 mt-0.5" />
                        <span className="break-words">{item.exact_source_anchor}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {isEscalated ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
                          <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                          Escalated Discrepancy
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                          <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                          Verified Tethered
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
  );
};
