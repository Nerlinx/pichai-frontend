import React, { useState } from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { 
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Vérifier les permissions admin
  if (!user || !['super_admin', 'admin', 'moderator', 'editor'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  const navigation = [
    { name: 'Tableau de Bord', href: '/admin', icon: HomeIcon, permission: ['super_admin', 'admin', 'moderator', 'editor'] },
    { name: 'Utilisateurs', href: '/admin/users', icon: UsersIcon, permission: ['super_admin', 'admin', 'moderator'] },
    { name: 'Engagements', href: '/admin/claims', icon: DocumentTextIcon, permission: ['super_admin', 'admin', 'moderator', 'editor'] },
    { name: 'Prédictions', href: '/admin/predictions', icon: ChartBarIcon, permission: ['super_admin', 'admin', 'analyst'] },
    { name: 'Analytiques', href: '/admin/analytics', icon: ChartBarIcon, permission: ['super_admin', 'admin', 'analyst'] },
    { name: 'Journaux', href: '/admin/audit', icon: ShieldCheckIcon, permission: ['super_admin', 'admin'] },
    { name: 'Paramètres', href: '/admin/settings', icon: Cog6ToothIcon, permission: ['super_admin', 'admin'] },
  ];

  const filteredNav = navigation.filter(item => 
    item.permission.includes(user.role)
  );

  const stats = [
    { name: 'Utilisateurs totaux', value: '1,234', change: '+12%', icon: UsersIcon },
    { name: 'Engagements en attente', value: '45', change: '+3', icon: DocumentTextIcon },
    { name: 'Prédictions aujourd\'hui', value: '289', change: '+18%', icon: ChartBarIcon },
    { name: 'Taux d\'approbation', value: '92%', change: '+2%', icon: ShieldCheckIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar pour mobile */}
      <div className={`lg:hidden ${sidebarOpen ? 'fixed inset-0 z-50' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 max-w-full flex-col bg-gray-900">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600" />
              <span className="ml-3 text-xl font-bold text-white">Admin Expand</span>
            </div>
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const current = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    current
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${current ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Barre latérale statique pour desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-900">
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600" />
              <span className="ml-3 text-xl font-bold text-white">Admin Expand</span>
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5">
            <nav className="flex-1 space-y-1 px-4">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                const current = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${current ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="mt-auto p-4">
              <div className="rounded-lg bg-gray-800 p-4">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user.full_name || user.email}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="mt-4 w-full flex items-center justify-center rounded-md border border-transparent bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600"
                >
                  <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de navigation principale */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Link
                    to="/"
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Retour au site public
                  </Link>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                  >
                    <BellIcon className="h-6 w-6" />
                  </button>
                  
                  <div className="relative">
                    <div className="flex items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{user.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;