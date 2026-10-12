import React, { useState } from 'react';
import { 
  CheckSquare, 
  Stethoscope, 
  UserCheck, 
  TestTube2, 
  Pill, 
  Clock, 
  AlertCircle, 
  Check, 
  FileCheck2,
  Filter
} from 'lucide-react';
import { ActionItem, RoleAssignment, UrgencyTier } from '../types';

interface ActionItemsViewProps {
  actionItems: ActionItem[];
}

export const ActionItemsView: React.FC<ActionItemsViewProps> = ({ actionItems }) => {
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  const toggleComplete = (id: string) => {
    setCompletedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredItems = actionItems.filter(item => {
    if (roleFilter === 'ALL') return true;
    return item.assigned_role === roleFilter;
  });

  const getRoleIcon = (role: RoleAssignment) => {
    switch (role) {
      case 'Attending_Physician':
        return <Stethoscope className="w-4 h-4 text-sky-600" />;
      case 'Care_Coordinator':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'Laboratory':
        return <TestTube2 className="w-4 h-4 text-purple-600" />;
      case 'Pharmacy':
        return <Pill className="w-4 h-4 text-amber-600" />;
    }
  };

  const getUrgencyBadge = (urgency: UrgencyTier) => {
    switch (urgency) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
            URGENT
          </span>
        );
      case 'Priority':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
            PRIORITY
          </span>
        );
      case 'Routine':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 rounded-full">
            ROUTINE
          </span>
        );
    }
  };

  const countByRole = {
    Attending_Physician: actionItems.filter(a => a.assigned_role === 'Attending_Physician').length,
    Care_Coordinator: actionItems.filter(a => a.assigned_role === 'Care_Coordinator').length,
    Laboratory: actionItems.filter(a => a.assigned_role === 'Laboratory').length,
    Pharmacy: actionItems.filter(a => a.assigned_role === 'Pharmacy').length,
  };

  return (
    <div className="space-y-6">
      {/* Header & Role Statistics Summary */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Role-Categorized Action Items
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tasks routed across clinical roles with urgency tiers and physician verification checkpoints.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              aria-label="Filter action items by role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
            >
              <option value="ALL">All Roles ({actionItems.length})</option>
              <option value="Attending_Physician">Attending Physician ({countByRole.Attending_Physician})</option>
              <option value="Care_Coordinator">Care Coordinator ({countByRole.Care_Coordinator})</option>
              <option value="Laboratory">Laboratory ({countByRole.Laboratory})</option>
              <option value="Pharmacy">Pharmacy ({countByRole.Pharmacy})</option>
            </select>
          </div>
        </div>

        {/* Role Quick Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setRoleFilter('Attending_Physician')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              roleFilter === 'Attending_Physician'
                ? 'bg-sky-50 border-sky-400 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900 flex items-center">
                <Stethoscope className="w-3.5 h-3.5 mr-1 text-sky-600" />
                Attending MD
              </span>
              <span className="text-sm font-bold text-slate-800">{countByRole.Attending_Physician}</span>
            </div>
          </button>

          <button
            onClick={() => setRoleFilter('Care_Coordinator')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              roleFilter === 'Care_Coordinator'
                ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center">
                <UserCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Care Coord
              </span>
              <span className="text-sm font-bold text-slate-800">{countByRole.Care_Coordinator}</span>
            </div>
          </button>

          <button
            onClick={() => setRoleFilter('Laboratory')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              roleFilter === 'Laboratory'
                ? 'bg-purple-50 border-purple-400 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 flex items-center">
                <TestTube2 className="w-3.5 h-3.5 mr-1 text-purple-600" />
                Diagnostic Lab
              </span>
              <span className="text-sm font-bold text-slate-800">{countByRole.Laboratory}</span>
            </div>
          </button>

          <button
            onClick={() => setRoleFilter('Pharmacy')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              roleFilter === 'Pharmacy'
                ? 'bg-amber-50 border-amber-400 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center">
                <Pill className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Pharmacy
              </span>
              <span className="text-sm font-bold text-slate-800">{countByRole.Pharmacy}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {filteredItems.map((item, idx) => {
          const isDone = completedMap[item.item_id];
          return (
            <div
              key={item.item_id || idx}
              className={`p-5 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-slate-50/70 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start space-x-3.5 flex-1">
                  <button
                    onClick={() => toggleComplete(item.item_id)}
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      isDone
                        ? 'bg-teal-600 border-teal-500 text-white'
                        : 'border-slate-300 bg-white hover:border-teal-500'
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-md">
                        {item.item_id}
                      </span>
                      {getUrgencyBadge(item.urgency)}
                      <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-full">
                        {getRoleIcon(item.assigned_role)}
                        <span className="ml-1.5">{item.assigned_role.replace('_', ' ')}</span>
                      </span>

                      {item.physician_verification_required && (
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          MD Sign-Off Required
                        </span>
                      )}
                    </div>

                    <h3 className={`text-sm font-bold text-slate-900 ${isDone ? 'line-through text-slate-400' : ''}`}>
                      {item.description}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.action_rationale}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
                      <span>Related Conflict: {item.related_conflict_id || 'None (Routine Follow-up)'}</span>
                      <span>Target Execution: {item.target_completion_timeframe}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-start sm:self-auto">
                  <span className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-150">
                    {item.target_completion_timeframe}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
