import React, { useState } from 'react';
import { useUser } from '../hooks/useUser';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    const newErrors = {};
    if (!formData.username.trim() || formData.username.trim().length < 3)
      newErrors.username = '3 caractères minimum';
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format d'email invalide";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = '8 caractères minimum';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrors({ general: data.detail || "Une erreur est survenue lors de l'inscription" });
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Compte créé avec succès. Connexion...');

      const loginResult = await login({
        email: formData.email,
        password: formData.password,
      });

      if (!loginResult.success) {
        navigate('/connexion');
        return;
      }

      const userData = loginResult.user || {};
      const roles = userData.roles || [];

      setTimeout(() => {
        if (roles.includes('admin') || roles.includes('superadmin')) {
          navigate('/admin/dashboard');
        } else if (roles.includes('moderator')) {
          navigate('/moderator/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1200);
    } catch (error) {
      setErrors({ general: 'Impossible de contacter le serveur. Vérifiez votre connexion.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const EyeOpen = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor">
      <path strokeWidth="2" d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
    </svg>
  );

  const EyeClosed = () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor">
      <path strokeWidth="2" d="M3 3l18 18" />
      <path strokeWidth="2" d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-1.42" />
      <path strokeWidth="2" d="M9.88 4.24A10.46 10.46 0 0112 4c6 0 10 8 10 8a18.5 18.5 0 01-3.18 4.36" />
    </svg>
  );

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
            Anticipez, participez, comprenez ensemble
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Rejoignez l’intelligence collective augmentée par l’IA
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 text-center">{successMessage}</p>
          </div>
        )}

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 text-center">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text" name="username" value={formData.username} onChange={handleChange}
              placeholder="Nom d'utilisateur" autoComplete="username"
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all duration-200 ${
                errors.username ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          <div>
            <input
              type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Email" autoComplete="email"
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all duration-200 ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password" value={formData.password} onChange={handleChange}
                placeholder="Mot de passe" autoComplete="new-password"
                className={`w-full px-4 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all duration-200 ${
                  errors.password ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              <button
                type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeClosed /> : <EyeOpen />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                placeholder="Confirmer mot de passe" autoComplete="new-password"
                className={`w-full px-4 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all duration-200 ${
                  errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              <button
                type="button" onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeClosed /> : <EyeOpen />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <p className="text-xs text-center text-gray-400">
            En continuant, vous acceptez nos{' '}
            <Link to="/conditions" className="underline hover:text-gray-600">conditions d’utilisation</Link>
          </p>

          <button
            type="submit" disabled={isLoading}
            className="w-full bg-stone-700 text-white py-2 rounded-full hover:bg-stone-800 disabled:opacity-60 transition-all duration-200 font-medium flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Création...
              </>
            ) : (
              'Rejoindre PichAI'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Déjà un compte ?{' '}
            <Link to="/connexion" className="text-stone-700 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>

        {/* Avantages */}
        <div className="mt-6 bg-stone-50 p-4 rounded-lg text-xs text-gray-600">
          <p className="font-medium mb-2 text-gray-700">Avec PichAI vous pouvez :</p>
          <ul className="space-y-1">
            <li>• Participer aux analyses collectives</li>
            <li>• Suivre vos contributions</li>
            <li>• Explorer les insights IA</li>
            <li>• Anticiper les tendances</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
        <LockIcon />
        <span>Connexion sécurisée • Données protégées</span>
      </div>
    </div>
  );
};

export default SignupPage;