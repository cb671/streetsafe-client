import React, { useState, useEffect } from 'react';
import Icons from "../components/Icons.jsx";
import { getEducationalResources } from "../api/api.js";

export default function Learn() {
  const [resources, setResources] = useState([]);
  const [personalisation, setPersonalisation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPersonalised, setShowPersonalised] = useState(true);

  const fetchResources = async (personalised = true) => {
    try {
      setIsLoading(true);
      const data = await getEducationalResources(personalised);
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

  useEffect(() => {
    fetchResources(showPersonalised);
  }, [showPersonalised]); 

  const getTypeColor = (type) => {
    switch (type) {
      case 'guide': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'article': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'video': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'tool': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getCrimeTypeDisplayName = (crimeType) => {
    const crimeTypeMap = {
      'violent': 'Violent Crime',
      'damage': 'Criminal Damage',
      'anti_social': 'Anti Social Behaviour',
      'shoplifting': 'Shoplifting',
      'burglary': 'Burglary',
      'theft': 'Theft',
      'robbery': 'Robbery',
      'vehicle': 'Vehicle Crime',
      'drugs': 'Drug Offences'
    };
    
    if (crimeTypeMap[crimeType]) {
      return crimeTypeMap[crimeType];
    }
    
    return crimeType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
        <div className="min-h-screen bg-gray-950 text-whiteish flex items-center justify-center p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-2 border-whiteish/30 border-t-whiteish rounded-full animate-spin"></div>
            <p className="text-lg font-medium">Loading educational resources...</p>
          </div>
        </div>
        <Icons />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="min-h-screen bg-gray-950 text-whiteish p-6">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl font-heading text-center mb-8 text-whiteish">
              Learn about Crime and Safety
            </h1>
            <div className="text-center">
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 backdrop-blur">
                <p className="text-red-300 text-lg">Error loading resources: {error}</p>
              </div>
            </div>
          </div>
        </div>
        <Icons />
      </>
    );
  }


  const displayResources = resources;

  return (
    <>
      <div className="min-h-screen bg-gray-950 text-whiteish p-6 pb-28">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-heading text-whiteish mb-4">
              Learn about Crime and Safety
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-gray-400 mx-auto rounded-full"></div>
          </div>


          {personalisation?.isPersonalised !== null && (
            <div className="flex justify-center mb-8">
              <div className="bg-grey/40 rounded-full p-1 border border-whiteish/10">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowPersonalised(true)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      showPersonalised
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-whiteish/60 hover:text-whiteish'
                    }`}
                  >
                    Personalised for You
                  </button>
                  <button
                    onClick={() => setShowPersonalised(false)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      !showPersonalised
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-whiteish/60 hover:text-whiteish'
                    }`}
                  >
                    All Resources
                  </button>
                </div>
              </div>
            </div>
          )}


          {personalisation?.isPersonalised && showPersonalised && (
            <div className="relative mb-8">
              <div className="bg-gradient-to-r from-blue-500/10 to-gray-500/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-gray-500/5 backdrop-blur"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                      <span className="text-blue-300 text-xl">📍</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-whiteish">
                      Personalised for {personalisation.userLocation}
                    </h2>
                  </div>
                  <p className="text-blue-200/80 mb-4 text-lg">
                    Resources are prioritised based on common crimes in your area
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {personalisation.topLocalCrimes.map((crime, index) => (
                      <span
                        key={index}
                        className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium backdrop-blur"
                      >
                        {getCrimeTypeDisplayName(crime)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6 text-center">
            <p className="text-whiteish/60 text-sm">
              {showPersonalised && personalisation?.isPersonalised
                ? `Showing ${displayResources.length} resources prioritised for your area`
                : `Showing all ${displayResources.length} resources`
              }
            </p>
          </div>

          {displayResources.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-grey/50 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <p className="text-xl text-whiteish/60">No educational resources available at this time.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {displayResources.map((resource) => {
                const isRelevant = isRelevantToUser(resource);
                const shouldHighlight = showPersonalised && personalisation?.isPersonalised && isRelevant;

                return (
                  <div
                    key={resource.id}
                    className={`group relative rounded-2xl p-6 backdrop-blur transition-all duration-300 hover:scale-[1.02] ${
                      shouldHighlight
                        ? 'bg-gradient-to-r from-blue-500/10 to-gray-500/10 border border-blue-500/30 shadow-xl shadow-blue-500/10' 
                        : 'bg-grey/40 border border-whiteish/10 hover:border-whiteish/20 hover:bg-grey/60'
                    }`}
                  >

                    {shouldHighlight && (
                      <div className="absolute -top-3 -right-3">
                        <div className="bg-gradient-to-r from-blue-500 to-gray-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                           Relevant to Your Area
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <h2 className="text-2xl font-semibold text-whiteish mb-2 group-hover:text-blue-300 transition-colors">
                          {resource.title}
                        </h2>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur ${getTypeColor(resource.type)}`}>
                        {resource.type.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-whiteish/80 mb-6 leading-relaxed text-lg">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-whiteish/60 font-medium">
                          {resource.target_crime_type
                            .split(', ')
                            .map(crime => getCrimeTypeDisplayName(crime.trim()))
                            .join(', ')
                          }
                        </span>
                      </div>
                      
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-gray-600 hover:from-blue-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <span className="relative z-10 flex items-center space-x-2">
                          <span>View Resource</span>
                          <span className="transform transition-transform group-hover/btn:translate-x-1">→</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
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
