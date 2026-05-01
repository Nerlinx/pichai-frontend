import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { adminAPI } from '../../services/api';
import UserTable from '../../components/admin/UserTable';
import UserFilters from '../../components/admin/UserFilters';
import BulkActions from '../../components/admin/BulkActions';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    sortBy: 'newest',
    page: 1,
    limit: 20
  });

  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0
  });

  useEffect(() => {
    loadUsers();
  }, [filters.page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getUsers(filters);
      setUsers(data);
      setFilteredUsers(data);
      
      // Calculer les statistiques
      const stats = {
        total: data.length,
        active: data.filter(u => u.status === 'active').length,
        pending: data.filter(u => u.status === 'pending').length,
        suspended: data.filter(u => u.status === 'suspended').length
      };
      setStats(stats);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSearch = (value) => {
    handleFilterChange({ search: value });
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;
    
    try {
      switch (action) {
        case 'activate':
          await Promise.all(
            selectedUsers.map(id => 
              adminAPI.updateUser(id, { status: 'active' })
            )
          );
          break;
          
        case 'suspend':
          await Promise.all(
            selectedUsers.map(id => 
              adminAPI.suspendUser(id, "Action administrative")
            )
          );
          break;
          
        case 'delete':
          // Demander confirmation
          if (window.confirm(`Supprimer ${selectedUsers.length} utilisateur(s) ?`)) {
            await Promise.all(
              selectedUsers.map(id => 
                adminAPI.deleteUser(id)
              )
            );
          }
          break;
          
        case 'export':
          const exportData = await adminAPI.exportUsers();
          // Télécharger le fichier
          const blob = new Blob([exportData.data], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = exportData.filename;
          a.click();
          break;
      }
      
      // Recharger les utilisateurs
      loadUsers();
      setSelectedUsers([]);
      
    } catch (error) {
      console.error('Erreur action groupée:', error);
    }
  };

  const userStats = [
    {
      title: 'Total Utilisateurs',
      value: stats.total,
      color: 'bg-blue-500',
      icon: UsersIcon
    },
    {
      title: 'Actifs',
      value: stats.active,
      color: 'bg-green-500',
      icon: ShieldCheckIcon
    },
    {
      title: 'En Attente',
      value: stats.pending,
      color: 'bg-yellow-500',
      icon: ClockIcon
    },
    {
      title: 'Suspendus',
      value: stats.suspended,
      color: 'bg-red-500',
      icon: ExclamationTriangleIcon
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="mt-2 text-gray-600">
            Gérez les comptes utilisateurs, permissions et statuts
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <UserPlusIcon className="inline h-5 w-5 mr-2" />
            Ajouter un utilisateur
          </button>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <FunnelIcon className="inline h-5 w-5 mr-2" />
            Filtres
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {userStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Rechercher par email, nom, username..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Actions groupées */}
            <BulkActions 
              selectedCount={selectedUsers.length}
              onAction={handleBulkAction}
            />
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <UserFilters 
                filters={filters}
                onChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* Tableau des utilisateurs */}
        <div className="overflow-x-auto">
          <UserTable 
            users={filteredUsers}
            loading={loading}
            selectedUsers={selectedUsers}
            onSelectUser={setSelectedUsers}
            onUserAction={(userId, action) => {
              // Gérer les actions individuelles
              handleBulkAction(action, [userId]);
            }}
            onRefresh={loadUsers}
          />
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{filteredUsers.length}</span> utilisateurs
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange({ page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              
              <span className="px-3 py-1 text-sm">
                Page {filters.page}
              </span>
              
              <button
                onClick={() => handleFilterChange({ page: filters.page + 1 })}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex">
          <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Bonnes pratiques de gestion</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Toujours communiquer avec l'utilisateur avant une suspension</li>
                <li>Vérifier l'historique d'activité avant de prendre des mesures</li>
                <li>Utiliser les rôles appropriés pour chaque type d'utilisateur</li>
                <li>Documenter les raisons des actions administratives</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composants auxiliaires
const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default UsersPage;