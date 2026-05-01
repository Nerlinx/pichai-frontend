import React, { useState, useEffect, useRef } from 'react';
import { 
  PaperAirplaneIcon, 
  UserCircleIcon,
  CogIcon,
  SparklesIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { chatAPI } from '../../services/api';

const LiveChat = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant IA d'Expand. Je peux vous aider à analyser des engagements, évaluer leur crédibilité, ou discuter des prédictions en cours. Comment puis-je vous aider aujourd'hui ?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "Quelle est la crédibilité du plan de création d'emplois ?",
    "Analysez-moi les tendances économiques récentes",
    "Comparez les engagements éducatifs des 2 dernières années",
    "Quels sont les risques du nouveau programme de santé ?"
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simulate AI response
      setTimeout(() => {
        const aiResponses = [
          {
            text: `J'analyse votre question "${text}"... Basé sur les données disponibles, je peux vous dire que...`,
            sender: 'ai',
            analysis: {
              confidence: 0.72,
              keyPoints: ["Facteur 1 pertinent", "Facteur 2 à considérer", "Risque identifié"],
              recommendations: ["Surveiller les prochaines annonces", "Comparer avec engagements similaires"]
            }
          },
          {
            text: "Je note que cette question concerne un engagement récent. Voici mon analyse détaillée...",
            sender: 'ai',
            type: 'analysis'
          },
          {
            text: "D'après les prédictions collectives, la communauté est confiante à 65% sur ce sujet.",
            sender: 'ai',
            type: 'crowd_insight'
          }
        ];

        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        setMessages(prev => [...prev, {
          id: prev.length + 2,
          ...randomResponse,
          timestamp: new Date()
        }]);
        
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Erreur chat:', error);
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    const actionTexts = {
      'confidence': "Peux-tu analyser la crédibilité de cette promesse ?",
      'compare': "Compare cette information avec des données similaires",
      'predict': "Quelle est la probabilité que cela se réalise ?",
      'sources': "Montre-moi les sources vérifiées sur ce sujet"
    };
    
    handleSendMessage(actionTexts[action]);
  };

  const ChatMessage = ({ message }) => {
    const isAI = message.sender === 'ai';
    
    return (
      <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-6`}>
        <div className={`max-w-[80%] ${isAI ? 'ml-2' : 'mr-2'}`}>
          <div className={`rounded-2xl px-5 py-3 ${
            isAI 
              ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200' 
              : 'bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200'
          }`}>
            <div className="flex items-start mb-2">
              {isAI ? (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
              ) : (
                <UserCircleIcon className="w-8 h-8 text-purple-600 mr-3" />
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">
                  {isAI ? 'Assistant IA Expand' : 'Vous'}
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{message.text}</p>
                
                {/* Analysis Cards for AI messages */}
                {message.analysis && (
                  <div className="mt-4 space-y-3">
                    <div className="bg-white/50 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <ChartBarIcon className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="font-medium">Score de confiance: {Math.round(message.analysis.confidence * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                          style={{ width: `${message.analysis.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    {message.analysis.keyPoints && (
                      <div className="bg-white/50 rounded-lg p-3">
                        <div className="font-medium mb-2">Points clés:</div>
                        <ul className="text-sm space-y-1">
                          {message.analysis.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 text-right">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          {/* Quick Actions for AI messages */}
          {isAI && !message.analysis && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickAction('confidence')}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition"
              >
                Analyser crédibilité
              </button>
              <button
                onClick={() => handleQuickAction('compare')}
                className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full hover:bg-purple-200 transition"
              >
                Comparer données
              </button>
              <button
                onClick={() => handleQuickAction('predict')}
                className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200 transition"
              >
                Faire prédiction
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <SparklesIcon className="w-8 h-8 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Assistant IA</h3>
              <p className="text-sm text-white/80">Analysez et discutez en temps réel</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="text-white/80 hover:text-white"
          >
            <CogIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="max-w-[80%] ml-2">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl px-5 py-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    <SparklesIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <div className="text-xs text-gray-500 mb-2 flex items-center">
          <LightBulbIcon className="w-3 h-3 mr-1" />
          Questions suggérées:
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedQuestions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(question)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition whitespace-nowrap"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Posez une question, analysez un engagement..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex justify-center space-x-4 mt-3">
          <button
            onClick={() => handleQuickAction('confidence')}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
          >
            <ChartBarIcon className="w-3 h-3 mr-1" />
            Analyse crédibilité
          </button>
          <button
            onClick={() => handleQuickAction('compare')}
            className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
          >
            <SparklesIcon className="w-3 h-3 mr-1" />
            Comparer données
          </button>
          <button
            onClick={() => handleQuickAction('sources')}
            className="text-xs text-green-600 hover:text-green-800 flex items-center"
          >
            <LightBulbIcon className="w-3 h-3 mr-1" />
            Sources vérifiées
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;