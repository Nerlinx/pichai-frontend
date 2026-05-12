import { claimAnonymousVotes } from '../services/voteService';
import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData);

      if (!result.success) {
        setErrors({
          general: result.error || 'Identifiants incorrects',
        });

        setIsLoading(false);
        return;
      }

      claimAnonymousVotes().then(r => {
        if (r.claimed > 0) {
          // console.log(`[Login] ${r.claimed} contribution(s) récupérée(s)`);
        }
      });

      const userData = result.user || {};
      const roles = userData.roles || [];

      if (roles.includes('admin') || roles.includes('superadmin')) {
        navigate('/admin/dashboard');
      } else if (roles.includes('moderator')) {
        navigate('/moderator/dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      setErrors({
        general: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4 text-gray-400">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 leading-tight">
            Participez aux sujets qui comptent
          </h1>
          <p className="text-sm text-gray-500 mt-2">Analysez avec l’appui de l’IA</p>
          <p className="text-xs text-gray-400 mt-2">Retrouvez vos contributions après connexion</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 text-center">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Votre email" autoComplete="email"
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all duration-200 ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600 text-center">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password" name="password" value={formData.password} onChange={handleChange}
              placeholder="Votre mot de passe" autoComplete="current-password"
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all duration-200 ${
                errors.password ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600 text-center">{errors.password}</p>}
            <div className="mt-1 text-right">
              {/*<Link to="/mot-de-passe-oublie" className="text-xs text-gray-400 hover:text-gray-600 underline">
                Mot de passe oublié ?
              </Link>*/}
            </div>
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full bg-stone-700 text-white py-2 rounded-full hover:bg-stone-800 disabled:opacity-60 transition-all duration-200 font-medium flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Accès en cours...
              </>
            ) : (
              'Accéder à mon espace'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="text-stone-700 font-medium hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
        <LockIcon />
        <span>Connexion sécurisée • Vos données sont protégées</span>
      </div>
    </div>
  );
};

export default LoginPage;