import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // ============ VALIDATION MOT DE PASSE ============
  const passwordRequirements = [
    { label: '8 caractères minimum', test: (pwd) => pwd.length >= 8 },
    { label: '1 lettre majuscule',   test: (pwd) => /[A-Z]/.test(pwd) },
    { label: '1 lettre minuscule',   test: (pwd) => /[a-z]/.test(pwd) },
    { label: '1 chiffre',            test: (pwd) => /\d/.test(pwd) },
    { label: '1 caractère spécial',  test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ];

  const getPasswordStrength = (password) => {
    const passed = passwordRequirements.filter(req => req.test(password)).length;
    if (passed === 5) return { strength: 'fort',   color: 'text-green-600', bg: 'bg-green-500' };
    if (passed >= 3)  return { strength: 'moyen',  color: 'text-yellow-600', bg: 'bg-yellow-500' };
    return               { strength: 'faible', color: 'text-red-600',   bg: 'bg-red-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordProgress = (passwordRequirements.filter(r => r.test(formData.password)).length / passwordRequirements.length) * 100;

  // ============ SOUMISSION ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    // Validation côté client
    const newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "Le nom d'utilisateur est requis";
    else if (formData.username.trim().length < 3)
      newErrors.username = "Minimum 3 caractères";

    if (!formData.email)
      newErrors.email = "L'email est requis";

    if (!formData.password)
      newErrors.password = 'Le mot de passe est requis';
    else if (passwordStrength.strength === 'faible')
      newErrors.password = 'Le mot de passe est trop faible';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';

    if (!formData.acceptTerms)
      newErrors.acceptTerms = 'Vous devez accepter les conditions';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Appel réel à votre backend FastAPI
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
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
        // Gérer les erreurs backend
        if (data.detail === 'Email déjà utilisé') {
          setErrors({ email: 'Cet email est déjà associé à un compte' });
        } else {
          setErrors({ general: data.detail || "Une erreur est survenue lors de l'inscription" });
        }
        return;
      }

      // Succès — message et redirection vers connexion
      setSuccessMessage('Compte créé avec succès ! Redirection vers la connexion...');
      setTimeout(() => navigate('/connexion'), 2000);

    } catch (error) {
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-xl border border-gray-200 p-8">

            {/* En-tête */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Rejoindre la communauté EXPAND
              </h1>
              <p className="text-gray-600 text-sm">
                Créez votre compte pour participer aux analyses collectives
              </p>
            </div>

            {/* Message de succès */}
            {successMessage && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {/* Erreur générale */}
            {errors.general && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 text-center">{errors.general}</p>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Nom d'utilisateur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 ${
                      errors.username ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="jean_dupont"
                    autoComplete="username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
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
                    placeholder="Créez un mot de passe sécurisé"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>

                {/* Barre de force */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Force du mot de passe</span>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.strength.toUpperCase()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${passwordStrength.bg}`}
                        style={{ width: `${passwordProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Critères */}
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {passwordRequirements.map((req, i) => {
                    const met = req.test(formData.password);
                    return (
                      <div key={i} className="flex items-center gap-1.5">
                        {met
                          ? <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                          : <XCircleIcon className="w-4 h-4 text-gray-300 shrink-0" />
                        }
                        <span className={`text-xs ${met ? 'text-gray-600' : 'text-gray-400'}`}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Retapez votre mot de passe"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {/* Indicateur match en temps réel */}
                {formData.confirmPassword && (
                  <div className="mt-1 flex items-center gap-1.5">
                    {formData.password === formData.confirmPassword
                      ? <><CheckCircleIcon className="w-4 h-4 text-green-500" /><span className="text-xs text-green-600">Les mots de passe correspondent</span></>
                      : <><XCircleIcon className="w-4 h-4 text-red-400" /><span className="text-xs text-red-500">Les mots de passe ne correspondent pas</span></>
                    }
                  </div>
                )}
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="h-4 w-4 mt-0.5 text-gray-700 border-gray-300 rounded focus:ring-gray-400"
                  />
                  <div className="ml-2">
                    <label className="text-sm text-gray-700">
                      J'accepte les{' '}
                      <Link to="/conditions" className="text-blue-600 hover:text-blue-800">conditions d'utilisation</Link>
                      {' '}et la{' '}
                      <Link to="/confidentialite" className="text-blue-600 hover:text-blue-800">politique de confidentialité</Link>
                    </label>
                    {errors.acceptTerms && (
                      <p className="mt-0.5 text-sm text-red-600">{errors.acceptTerms}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="h-4 w-4 mt-0.5 text-gray-700 border-gray-300 rounded focus:ring-gray-400"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Je souhaite recevoir les analyses hebdomadaires et les mises à jour importantes
                  </label>
                </div>
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
                    Création du compte...
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </button>
            </form>

            {/* Lien connexion */}
            <div className="text-center pt-6 border-t border-gray-200 mt-6">
              <p className="text-gray-600 text-sm">
                Vous avez déjà un compte ?{' '}
                <Link to="/connexion" className="text-blue-600 hover:text-blue-800 font-medium">
                  Se connecter
                </Link>
              </p>
            </div>

            {/* Avantages */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3 text-sm">
                En créant un compte, vous pourrez :
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Participer aux analyses d'événements",
                  "Suivre votre score de crédibilité",
                  "Accéder aux analyses IA avancées",
                  "Contribuer à l'intelligence collective"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              En cas de difficulté, contactez-nous à{' '}
              <a href="mailto:support@expand.ht" className="text-gray-500 hover:text-gray-700">
                support@expand.ht
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;