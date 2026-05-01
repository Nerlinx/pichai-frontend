import { claimAnonymousVotes } from '../services/voteService';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://10.236.42.100:8000';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ============ CONNEXION RÉELLE ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation côté client
    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Appel réel à votre backend FastAPI
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Gestion des erreurs backend (401, 400, etc.)
        setErrors({ general: data.detail || 'Identifiants incorrects' });
        return;
      }

      // Stockage du token
      const storage = localStorage; // Toujours localStorage — rememberMe gère juste la durée
      storage.setItem('access_token', data.access_token);
      // Associer les votes anonymes au compte connecté
      claimAnonymousVotes().then(r => {
        if (r.claimed > 0) console.log(`[Login] ${r.claimed} vote(s) associé(s)`);
      });
      storage.setItem('token_type', data.token_type);

      // Récupérer les infos de l'utilisateur connecté
      const meResponse = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      // Si /me n'existe pas encore, on décode les roles depuis le token JWT
      let roles = [];
      if (meResponse.ok) {
        const meData = await meResponse.json();
        roles = meData.roles || [];
        storage.setItem('user', JSON.stringify(meData));
      } else {
        // Décoder le JWT manuellement pour extraire les rôles
        try {
          const payload = JSON.parse(atob(data.access_token.split('.')[1]));
          roles = payload.roles || [];
        } catch {
          roles = [];
        }
      }

      // ============ REDIRECTION PAR RÔLE ============
      if (roles.includes('admin') || roles.includes('superadmin')) {
        navigate('/admin/dashboard');
      } else if (roles.includes('moderator')) {
        navigate('/moderator/dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      // Erreur réseau / serveur non disponible
      setErrors({ general: 'Impossible de contacter le serveur. Vérifiez votre connexion.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSocialLogin = (provider) => {
    // À intégrer selon votre provider OAuth
    console.log(`Login avec ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl border border-gray-200 p-8">

            {/* En-tête */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-gray-700" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Connexion à votre compte
              </h1>
              <p className="text-gray-600 text-sm">
                Accédez à votre espace personnel d'analyse
              </p>
            </div>

            {/* Erreur générale */}
            {errors.general && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 text-center">{errors.general}</p>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="vous@exemple.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <Link to="/mot-de-passe-oublie" className="text-sm text-blue-600 hover:text-blue-800">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-700 border-gray-300 rounded focus:ring-gray-400"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>

              {/* Bouton submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Lien inscription */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Vous n'avez pas de compte ?{' '}
                <Link to="/inscription" className="text-blue-600 hover:text-blue-800 font-medium">
                  S'inscrire maintenant
                </Link>
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default LoginPage;