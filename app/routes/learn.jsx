import React, { useState, useEffect } from 'react';
import Icons from "../components/Icons.jsx";
import { getEducationalResources } from "../api/api.js";

export default function Learn() {
  const [resources, setResources] = useState([]);
  const [personalisation, setPersonalisation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const data = await getEducationalResources();
        console.log('API Response:', data); 
        console.log('Personalisation:', data.personalisation);
        setResources(data.resources || []);
        setPersonalisation(data.personalisation || null);
      } catch (err) {
        console.error('Error fetching educational resources:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const getTypeColor = (type) => {
    switch (type) {
      case 'guide': return 'bg-blue-600';
      case 'article': return 'bg-green-600';
      case 'video': return 'bg-purple-600';
      case 'tool': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getCrimeTypeDisplayName = (crimeType) => {
    const crimeTypeMap = {
      'violent': 'Violent Crime',
      'damage': 'Criminal Damage',
      'anti_social': 'Anti-Social Behaviour',
      'shoplifting': 'Shoplifting',
      'burglary': 'Burglary',
      'theft': 'Theft',
      'robbery': 'Robbery',
      'vehicle': 'Vehicle Crime',
      'drugs': 'Drug Offences'
    };
    return crimeTypeMap[crimeType] || crimeType.charAt(0).toUpperCase() + crimeType.slice(1);
  };

  const isRelevantToUser = (resource) => {
    if (!personalisation?.isPersonalised || !personalisation?.topLocalCrimes) {
      return false;
    }
    
    return personalisation.topLocalCrimes.some(localCrime => 
      resource.target_crime_type.toLowerCase().includes(localCrime.toLowerCase()) ||
      localCrime.toLowerCase().includes(resource.target_crime_type.toLowerCase())
    );
  };

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
          <div className="text-xl">Loading educational resources...</div>
        </div>
        <Icons />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="min-h-screen bg-gray-900 text-white p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Learn about Crime and Safety</h1>
            <div className="text-center text-red-400">
              <p>Error loading resources: {error}</p>
            </div>
          </div>
        </div>
        <Icons />
      </>
    );
  }


  const sortedResources = [...resources].sort((a, b) => {
    const aRelevant = isRelevantToUser(a);
    const bRelevant = isRelevantToUser(b);
    
    if (aRelevant && !bRelevant) return -1;
    if (!aRelevant && bRelevant) return 1;
    

    return (b.relevance_score || 0) - (a.relevance_score || 0);
  });

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-8">Learn about Crime and Safety</h1>

          {}
          {personalisation?.isPersonalised && (
            <div className="bg-blue-800/50 border border-blue-700 rounded-lg p-4 mb-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-blue-300 mr-2">📍</span>
                <h2 className="text-lg font-semibold text-blue-100">
                  Personalised for {personalisation.userLocation}
                </h2>
              </div>
              <p className="text-blue-200 text-sm mb-3">
                Resources are prioritised based on common crimes in your area:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {personalisation.topLocalCrimes.map((crime, index) => (
                  <span
                    key={index}
                    className="bg-blue-700 text-blue-100 text-xs px-2 py-1 rounded-full"
                  >
                    {getCrimeTypeDisplayName(crime)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {sortedResources.length === 0 ? (
            <div className="text-center text-gray-400">
              <p>No educational resources available at this time.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedResources.map((resource) => {
                const isRelevant = isRelevantToUser(resource);
                
                return (
                  <div
                    key={resource.id}
                    className={`bg-gray-800 rounded-lg p-6 border transition-colors ${
                      isRelevant 
                        ? 'border-blue-600 bg-gray-800/80' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-semibold text-white">
                            {resource.title}
                          </h2>
                          {isRelevant && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Relevant to Your Area
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`${getTypeColor(resource.type)} text-white text-xs px-2 py-1 rounded-full uppercase font-medium`}>
                        {resource.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        <span className="font-medium">Crime Type:</span> {resource.target_crime_type}
                      </div>
                      
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        View Resource →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <Icons />
    </>
  );
}
