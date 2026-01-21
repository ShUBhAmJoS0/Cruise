import { useState, useEffect } from 'react';
import axios from 'axios';

const CommunityGuidelines = () => {
  const [guidelines, setGuidelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/community-guidelines');
      
      if (response.data.success) {
        setGuidelines(response.data.data);
      }
    } catch (err) {
      setError('Failed to load community guidelines');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading guidelines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Guidelines
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to Cruise! Please follow these guidelines to ensure a positive experience for everyone.
          </p>
        </div>

        {/* Guidelines List */}
        <div className="space-y-6">
          {guidelines.map((guideline) => (
            <div
              key={guideline.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                {guideline.icon && (
                  <div className="flex-shrink-0 text-4xl">
                    {guideline.icon}
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {guideline.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {guideline.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Message */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800">
            By using Cruise, you agree to follow these community guidelines. 
            Violations may result in account restrictions or removal from the platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;