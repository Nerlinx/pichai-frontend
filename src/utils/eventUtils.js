// frontend/src/utils/eventUtils.js
import {
  BuildingLibraryIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  HomeIcon,
  WifiIcon,
  UsersIcon,
  FireIcon
} from '@heroicons/react/24/outline';

export const getCategoryColor = (category) => {
  const colorMap = {
    'Économie': 'emerald', 'économie': 'emerald',
    'Politique': 'blue', 'politique': 'blue',
    'Santé': 'red', 'santé': 'red',
    'Éducation': 'amber', 'éducation': 'amber',
    'Infrastructure': 'purple', 'infrastructure': 'purple',
    'Agriculture': 'lime', 'agriculture': 'lime',
    'Société': 'indigo', 'société': 'indigo',
    'Sécurité': 'rose', 'sécurité': 'rose',
    'Environnement': 'green', 'environnement': 'green'
  };
  return colorMap[category] || 'gray';
};

export const getCategoryClass = (category) => {
  const color = getCategoryColor(category);
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    lime: 'bg-lime-50 text-lime-700 border-lime-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return colorClasses[color] || colorClasses.gray;
};

export const getCategoryIcon = (category) => {
  const iconMap = {
    'Économie': <BuildingLibraryIcon className="w-4 h-4" />,
    'économie': <BuildingLibraryIcon className="w-4 h-4" />,
    'Politique': <BuildingLibraryIcon className="w-4 h-4" />,
    'politique': <BuildingLibraryIcon className="w-4 h-4" />,
    'Santé': <ShieldCheckIcon className="w-4 h-4" />,
    'santé': <ShieldCheckIcon className="w-4 h-4" />,
    'Éducation': <AcademicCapIcon className="w-4 h-4" />,
    'éducation': <AcademicCapIcon className="w-4 h-4" />,
    'Infrastructure': <WifiIcon className="w-4 h-4" />,
    'infrastructure': <WifiIcon className="w-4 h-4" />,
    'Agriculture': <HomeIcon className="w-4 h-4" />,
    'agriculture': <HomeIcon className="w-4 h-4" />,
    'Société': <UsersIcon className="w-4 h-4" />,
    'société': <UsersIcon className="w-4 h-4" />,
  };
  return iconMap[category] || <FireIcon className="w-4 h-4" />;
};

export const getConsensusColor = (percentage) => {
  if (percentage >= 70) return 'text-emerald-700';
  if (percentage >= 40) return 'text-amber-700';
  return 'text-red-700';
};

export const getConsensusBgColor = (percentage) => {
  if (percentage >= 70) return 'bg-emerald-500';
  if (percentage >= 40) return 'bg-amber-500';
  return 'bg-red-500';
};

export const formatNumber = (num) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};