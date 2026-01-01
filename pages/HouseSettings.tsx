
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icons } from '../constants';
import { Permission, HouseRole, HouseMember, House } from '../types';

interface HouseSettingsProps {
  houses: House[];
  updateHouse: (h: House) => void;
}

const HouseSettings: React.FC<HouseSettingsProps> = ({ houses, updateHouse }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const house = houses.find(h => h.id === id);
  
  const [activeTab, setActiveTab] = useState<'roles' | 'members'>('roles');
  const [roles, setRoles] = useState<HouseRole[]>(house?.roles || []);
  const [members, setMembers] = useState<HouseMember[]>(house?.members || []);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(roles[0]?.id || null);

  if (!house) return <div className="p-10 text-white">House not found.</div>;

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  const saveChanges = (newRoles: HouseRole[], newMembers: HouseMember[]) => {
    updateHouse({
      ...house,
      roles: newRoles,
      members: newMembers
    });
  };

  const togglePermission = (permission: Permission) => {
    if (!selectedRoleId) return;
    const newRoles = roles.map(r => {
      if (r.id === selectedRoleId) {
        const hasPerm = r.permissions.includes(permission);
        return {
          ...r,
          permissions: hasPerm 
            ? r.permissions.filter(p => p !== permission)
            : [...r.permissions, permission]
        };
      }
      return r;
    });
    setRoles(newRoles);
    saveChanges(newRoles, members);
  };

  const handleAddRole = () => {
    const newRole: HouseRole = {
      id: `r-${Date.now()}`,
      name: 'New Operative',
      color: '#444444',
      permissions: []
    };
    const newRoles = [...roles, newRole];
    setRoles(newRoles);
    setSelectedRoleId(newRole.id);
    saveChanges(newRoles, members);
  };

  const handleChangeMemberRole = (memberId: string, roleId: string) => {
    const newMembers = members.map(m => m.id === memberId ? { ...m, roleId } : m);
    setMembers(newMembers);
    saveChanges(roles, newMembers);
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505]">
      {/* Header */}
      <div className="p-4 border-b border-[#222] bg-[#0a0a0a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#222] rounded-lg transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="font-bold text-lg">House Settings — {house.name}</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sub-navigation */}
        <div className="w-20 md:w-48 border-r border-[#222] bg-[#080808] p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('roles')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'roles' ? 'bg-[#1a1a1a] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <span className="hidden md:inline">Roles</span>
            <span className="md:hidden">🛡️</span>
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'members' ? 'bg-[#1a1a1a] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <span className="hidden md:inline">Members</span>
            <span className="md:hidden">👥</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {activeTab === 'roles' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl">
              {/* Role List */}
              <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">House Roles</h3>
                  <button onClick={handleAddRole} className="p-1 hover:bg-[#222] rounded-md text-gray-400 hover:text-white">
                    <Icons.Plus />
                  </button>
                </div>
                <div className="space-y-2">
                  {roles.map(role => (
                    <button 
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedRoleId === role.id ? 'bg-[#111] border-gray-600' : 'bg-transparent border-[#222] hover:border-gray-800'}`}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                      <span className="flex-1 font-bold text-sm">{role.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Editor */}
              <div className="lg:col-span-8 space-y-8">
                {selectedRole ? (
                  <div className="bg-[#0f0f0f] border border-[#222] rounded-3xl p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4">
                      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Role Identity</label>
                      <div className="flex gap-4">
                        <input 
                          type="text" 
                          className="flex-1 bg-black border border-[#333] rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all"
                          value={selectedRole.name}
                          onChange={(e) => {
                            const newName = e.target.value;
                            const updatedRoles = roles.map(r => r.id === selectedRole.id ? { ...r, name: newName } : r);
                            setRoles(updatedRoles);
                            saveChanges(updatedRoles, members);
                          }}
                        />
                        <input 
                          type="color" 
                          className="w-16 h-[48px] bg-black border border-[#333] rounded-xl p-1 cursor-pointer"
                          value={selectedRole.color}
                          onChange={(e) => {
                            const newColor = e.target.value;
                            const updatedRoles = roles.map(r => r.id === selectedRole.id ? { ...r, color: newColor } : r);
                            setRoles(updatedRoles);
                            saveChanges(updatedRoles, members);
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-[#222] pb-2">
                        <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Protocol Permissions</h4>
                        <span className="text-[10px] text-gray-700 font-bold">{selectedRole.permissions.length} Active Clearance</span>
                      </div>
                      
                      {/* NEW Checklist Implementation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.values(Permission).map((perm) => (
                          <div 
                            key={perm} 
                            onClick={() => togglePermission(perm)}
                            className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${selectedRole.permissions.includes(perm) ? 'bg-[#1a1a1a] border-gray-600' : 'bg-black border-[#222] hover:border-gray-800 opacity-60'}`}
                          >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedRole.permissions.includes(perm) ? 'bg-red-800 border-red-500' : 'bg-transparent border-gray-700'}`}>
                              {selectedRole.permissions.includes(perm) && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-sm text-gray-200 uppercase tracking-tighter">{perm.replace(/_/g, ' ')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-600 font-bold uppercase tracking-widest text-xs">
                    Select a role to modify clearance
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <div>
                  <h3 className="text-xl font-bold">House Personnel</h3>
                  <p className="text-sm text-gray-500">Manage clearance levels for your operatives.</p>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{members.length} Active Agents</div>
              </div>

              <div className="space-y-3">
                {members.map(member => {
                  const memberRole = roles.find(r => r.id === member.roleId);
                  return (
                    <div key={member.id} className="flex items-center gap-4 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl hover:bg-[#0f0f0f] transition-all">
                      <img src={member.avatar} className="w-12 h-12 rounded-xl border border-[#222]" alt="" />
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{member.username}</h4>
                        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden md:flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border" style={{ borderColor: memberRole?.color + '44', color: memberRole?.color }}>
                          {memberRole?.name}
                        </div>
                        <select 
                          className="bg-black border border-[#333] text-xs text-white rounded-lg px-3 py-2 focus:outline-none"
                          value={member.roleId}
                          onChange={(e) => handleChangeMemberRole(member.id, e.target.value)}
                        >
                          {roles.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseSettings;
