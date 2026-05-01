import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon,
  UserCircleIcon,
  CalendarIcon,
  TagIcon,
  MapPinIcon,
  LinkIcon,
  PhotoIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const SubmitClaimPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    title: '',
    description: '',
    category: '',
    
    // Step 2: Details
    claimant: '',
    source: '',
    date: '',
    
    // Step 3: Location & Evidence
    location: '',
    evidence: '',
    tags: [],
    
    // Step 4: Contact (optional)
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    anonymous: false
  });

  const categories = [
    { value: 'economy', label: 'Économie', icon: '💰', color: 'bg-blue-100 text-blue-800' },
    { value: 'education', label: 'Éducation', icon: '🎓', color: 'bg-purple-100 text-purple-800' },
    { value: 'health', label: 'Santé', icon: '🏥', color: 'bg-green-100 text-green-800' },
    { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️', color: 'bg-orange-100 text-orange-800' },
    { value: 'agriculture', label: 'Agriculture', icon: '🌾', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'technology', label: 'Technologie', icon: '💻', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'environment', label: 'Environnement', icon: '🌿', color: 'bg-teal-100 text-teal-800' },
    { value: 'governance', label: 'Gouvernance', icon: '🏛️', color: 'bg-gray-100 text-gray-800' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagAdd = (tag) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleTagRemove = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 2000);
  };

  const steps = [
    { number: 1, title: 'Information de base', description: 'Décrivez l\'engagement' },
    { number: 2, title: 'Détails', description: 'Source et contexte' },
    { number: 3, title: 'Preuves', description: 'Documents et localisation' },
    { number: 4, title: 'Contact', description: 'Informations facultatives' }
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Engagement Soumis avec Succès !
          </h1>
          <p className="text-gray-600 mb-8">
            Merci pour votre contribution. Votre engagement est maintenant en cours de vérification 
            et sera visible sur la plateforme dans les 24-48 heures.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition"
            >
              Retour à l'accueil
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setStep(1);
                setFormData({
                  title: '',
                  description: '',
                  category: '',
                  claimant: '',
                  source: '',
                  date: '',
                  location: '',
                  evidence: '',
                  tags: [],
                  contactName: '',
                  contactEmail: '',
                  contactPhone: '',
                  anonymous: false
                });
              }}
              className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Soumettre un autre engagement
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Retour
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <DocumentTextIcon className="w-10 h-10 inline-block mr-3 text-blue-600" />
            Soumettre un Engagement
          </h1>
          <p className="text-gray-600">
            Partagez une promesse, un engagement ou une déclaration à suivre pour contribuer à la transparence
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div 
                className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            {steps.map((stepItem) => (
              <div key={stepItem.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                  step >= stepItem.number
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {stepItem.number}
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${
                    step >= stepItem.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {stepItem.title}
                  </p>
                  <p className="text-xs text-gray-500">{stepItem.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Information de base</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'engagement *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Construction de 10 nouvelles écoles primaires"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description détaillée *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Décrivez l'engagement en détail. Incluez les objectifs, le contexte et les parties concernées."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Catégorie *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({...formData, category: cat.value})}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        formData.category === cat.value
                          ? `${cat.color} border-current transform scale-105`
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{cat.icon}</div>
                      <div className="text-sm font-medium">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails et contexte</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserCircleIcon className="w-4 h-4 inline-block mr-2" />
                  Personne/Entité responsable *
                </label>
                <input
                  type="text"
                  name="claimant"
                  value={formData.claimant}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Ministère de l'Éducation, Maire de Port-au-Prince"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LinkIcon className="w-4 h-4 inline-block mr-2" />
                  Source de l'information *
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Discours du 15 janvier 2024, Article de presse, Publication officielle"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="w-4 h-4 inline-block mr-2" />
                  Date de l'engagement *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Evidence */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Preuves et localisation</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPinIcon className="w-4 h-4 inline-block mr-2" />
                  Localisation concernée
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ex: Département de l'Ouest, Ville de Jacmel, Commune de..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <PhotoIcon className="w-4 h-4 inline-block mr-2" />
                  Preuves/Documents (URL)
                </label>
                <textarea
                  name="evidence"
                  value={formData.evidence}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Liens vers des articles, vidéos, documents officiels, photos..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TagIcon className="w-4 h-4 inline-block mr-2" />
                  Mots-clés
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ajouter un mot-clé"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTagAdd(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Ajouter un mot-clé"]');
                      if (input.value.trim()) {
                        handleTagAdd(input.value.trim());
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de contact (facultatif)</h2>
              
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData({...formData, anonymous: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="anonymous" className="ml-2 text-gray-700">
                  Soumettre anonymement
                </label>
              </div>

              {!formData.anonymous && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        placeholder="Votre nom"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        placeholder="votre@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="+509 XX XX XX XX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Vos informations de contact ne seront pas rendues publiques. 
                  Elles sont utilisées uniquement pour vous contacter si des précisions sont nécessaires 
                  lors de la vérification de votre soumission.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Précédent
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition"
              >
                Continuer
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Soumission en cours...
                  </span>
                ) : (
                  'Soumettre l\'engagement'
                )}
              </button>
            )}
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            En soumettant cet engagement, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            Toutes les soumissions sont vérifiées avant publication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmitClaimPage;