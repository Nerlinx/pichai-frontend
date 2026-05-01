import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentArrowUpIcon,
  ShieldCheckIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const SubmitPage = () => {
  const [submissionType, setSubmissionType] = useState('');

  const submissionTypes = [
    {
      id: 'promise',
      title: 'Promesse Publique',
      icon: DocumentArrowUpIcon,
      description: 'Une promesse faite par une autorité publique, élu ou institution',
      examples: ['Discours politique', 'Déclaration officielle', 'Programme gouvernemental'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'commitment',
      title: 'Engagement Formel',
      icon: ShieldCheckIcon,
      description: 'Engagement écrit ou contractualisé par une institution',
      examples: ['Contrat public', 'Plan stratégique', 'Accord international'],
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'project',
      title: 'Projet Annoncé',
      icon: EyeIcon,
      description: 'Projet d\'infrastructure ou de développement annoncé publiquement',
      examples: ['Construction d\'école', 'Route nationale', 'Programme social'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'milestone',
      title: 'Étape Intermédiaire',
      icon: ClockIcon,
      description: 'Point d\'avancement ou étape dans un projet plus large',
      examples: ['Phase de construction', 'Livraison partielle', 'Objectif intermédiaire'],
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const guidelines = [
    {
      icon: CheckCircleIcon,
      title: 'Vérifiez vos sources',
      description: 'Assurez-vous que l\'information provient d\'une source fiable et vérifiable'
    },
    {
      icon: InformationCircleIcon,
      title: 'Soyez précis',
      description: 'Incluez des détails concrets : dates, lieux, montants, objectifs'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Restez objectif',
      description: 'Décrivez les faits de manière neutre, sans opinion personnelle'
    },
    {
      icon: DocumentArrowUpIcon,
      title: 'Fournissez des preuves',
      description: 'Incluez des liens vers des articles, vidéos ou documents officiels'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            <DocumentArrowUpIcon className="w-12 h-12 inline-block mr-4 text-blue-600" />
            Soumettre un Engagement
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Contribuez à la transparence en partageant des engagements, promesses ou projets 
            à suivre sur notre plateforme.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Type Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                    1
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Sélectionnez le type d'engagement
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Choisissez la catégorie qui correspond le mieux à ce que vous souhaitez soumettre
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submissionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSubmissionType(type.id)}
                      className={`relative p-6 rounded-xl border-2 text-left transition-all transform hover:scale-[1.02] ${
                        submissionType === type.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color} mr-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{type.title}</h3>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-xs font-medium text-gray-500 mb-2">Exemples :</p>
                        <ul className="space-y-1">
                          {type.examples.map((example, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {submissionType === type.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircleIcon className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Guidelines */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">
                    2
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Consignes de soumission
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Pour assurer la qualité et la crédibilité des informations sur notre plateforme
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {guidelines.map((guideline, index) => {
                  const Icon = guideline.icon;
                  return (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg shadow-sm mr-4">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{guideline.title}</h4>
                        <p className="text-sm text-gray-600">{guideline.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                  <InformationCircleIcon className="w-5 h-5 mr-2" />
                  Processus de vérification
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      1
                    </div>
                    <p className="text-sm font-medium">Soumission</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      2
                    </div>
                    <p className="text-sm font-medium">Vérification</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      3
                    </div>
                    <p className="text-sm font-medium">Publication</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      4
                    </div>
                    <p className="text-sm font-medium">Suivi</p>
                  </div>
                </div>
                <p className="text-sm text-blue-700 mt-4">
                  Toutes les soumissions sont vérifiées par notre équipe avant d'être publiées sur la plateforme.
                  Le processus prend généralement 24-48 heures.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Steps */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Prochaines étapes</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold">1</span>
                  </div>
                  <span>Sélectionner le type</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold">2</span>
                  </div>
                  <span>Remplir le formulaire</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold">3</span>
                  </div>
                  <span>Ajouter des preuves</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold">4</span>
                  </div>
                  <span>Soumettre</span>
                </div>
              </div>

              {submissionType ? (
                <Link
                  to={`/submit/claim?type=${submissionType}`}
                  className="mt-6 w-full bg-white text-blue-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition flex items-center justify-center"
                >
                  Continuer
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <button
                  disabled
                  className="mt-6 w-full bg-white/30 text-white py-3 rounded-lg font-bold cursor-not-allowed"
                >
                  Sélectionnez un type pour continuer
                </button>
              )}
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Questions fréquentes</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Les soumissions sont-elles anonymes ?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Oui, vous pouvez choisir de soumettre anonymement. Vos informations de contact 
                    ne seront jamais rendues publiques.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Combien de temps prend la vérification ?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Généralement 24-48 heures. Nous vérifions soigneusement chaque soumission 
                    pour assurer la qualité des informations.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Puis-je modifier ma soumission ?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Oui, vous pouvez contacter notre équipe pour apporter des modifications 
                    avant la publication.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Impact de la communauté</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Soumissions ce mois</span>
                  <span className="font-bold text-gray-900">147</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taux de vérification</span>
                  <span className="font-bold text-green-600">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Engagements suivis</span>
                  <span className="font-bold text-gray-900">856</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temps moyen de réponse</span>
                  <span className="font-bold text-gray-900">18h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Vous avez des questions ou besoin d'aide pour votre soumission ?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@expand.ht"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Contactez notre équipe
            </a>
            <Link
              to="/guidelines"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Lire les consignes complètes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;