'use client';

import React, { useState } from 'react';

interface Visitor {
  _id?: string;
  name: string;
  email: string;
  company?: string;
  purpose?: string;
  timestamp?: string;
}

interface AdminVisitorsTableProps {
  visitors?: Visitor[];
}

export default function AdminVisitorsTable({ visitors = [] }: AdminVisitorsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVisitors = visitors.filter((visitor) => 
    visitor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
        <h3 className="text-lg font-semibold text-slate-100">Visitor Logs</h3>
        <input
          type="text"
          placeholder="Search visitors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/30">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Company</th>
              <th className="p-4 font-medium">Purpose</th>
              <th className="p-4 font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
            {filteredVisitors.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No visitors recorded yet.
                </td>
              </tr>
            ) : (
              filteredVisitors.map((visitor, index) => (
                <tr key={visitor._id || index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-medium text-slate-200">{visitor.name || 'Anonymous'}</td>
                  <td className="p-4 text-slate-400">{visitor.email || 'N/A'}</td>
                  <td className="p-4 text-slate-400">{visitor.company || '-'}</td>
                  <td className="p-4 text-slate-300 truncate max-w-xs">{visitor.purpose || '-'}</td>
                  <td className="p-4 text-slate-500 text-xs">
                    {visitor.timestamp ? new Date(visitor.timestamp).toLocaleString() : 'Recent'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}