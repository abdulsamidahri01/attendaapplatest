
import React, { useState } from 'react';
import { Search, Trash2, Edit2, Eye, Plus, Briefcase } from 'lucide-react';
import { EmployeeData } from '../types';

interface AllEmployeesProps {
  employees: EmployeeData[];
  onDelete: (id: string) => void;
  onNavigate?: (path: string, state?: any) => void;
  onEdit?: (employee: EmployeeData) => void;
}

const AllEmployees: React.FC<AllEmployeesProps> = ({ employees, onDelete, onNavigate, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.department && emp.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.id && emp.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddNew = () => {
    if (onEdit) onEdit(null as any);
    if (onNavigate) onNavigate('addnewteacher');
  };

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();
  
  const getRandomColor = (name: string) => {
    const colors = ['bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-purple-100 text-purple-600', 'bg-amber-100 text-amber-600', 'bg-rose-100 text-rose-600'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Employees</h1>
          <p className="text-sm text-gray-500 mt-1">Manage staff and teachers records.</p>
        </div>
        <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#5e81f4] text-white rounded-lg text-sm font-medium hover:bg-[#4b69c6] shadow-sm transition-all"
        >
            <Plus size={16} />
            Add New Employee
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e81f4]/50 focus:border-[#5e81f4] text-sm transition-all"
            />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4">Profile</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 w-16">
                       {emp.image ? (
                          <img src={emp.image} alt={emp.name} className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" />
                       ) : (
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm ${getRandomColor(emp.name)}`}>
                            {getInitials(emp.name)}
                          </div>
                       )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{emp.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                        {emp.department ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                {emp.department}
                            </span>
                        ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{emp.id}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => onEdit && onEdit(emp)}
                            className="p-2 text-gray-400 hover:text-[#5e81f4] hover:bg-blue-50 rounded-lg transition-colors"
                            title="View/Edit Profile"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                            onClick={() => onEdit && onEdit(emp)}
                            className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Employee"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                            onClick={() => onDelete(emp.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Employee"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400 bg-gray-50/30">
                    <div className="flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            {employees.length === 0 ? "Start by adding new employees to the system." : "Try adjusting your search terms."}
                        </p>
                        {employees.length === 0 && (
                             <button 
                             onClick={handleAddNew}
                             className="mt-4 text-sm font-medium text-[#5e81f4] hover:text-[#4b69c6]"
                         >
                             Add First Employee
                         </button>
                        )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllEmployees;
