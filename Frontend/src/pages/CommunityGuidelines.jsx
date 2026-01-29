import { useState } from 'react';
import { Shield, Users, Heart, AlertCircle, MessageCircle, Flag, CheckCircle, XCircle } from 'lucide-react';

export default function CommunityGuidelines() {
  const [activeSection, setActiveSection] = useState(null);

  const guidelines = [
    {
      id: 1,
      icon: <Heart className="w-6 h-6" />,
      title: "Be Respectful",
      description: "Treat all community members with respect and kindness.",
      details: [
        "Use polite and professional language",
        "Respect different opinions and perspectives",
        "No harassment, bullying, or hate speech",
        "Be considerate of cultural differences"
      ]
    },
    {
      id: 2,
      icon: <Users className="w-6 h-6" />,
      title: "Foster Inclusivity",
      description: "Create a welcoming environment for everyone.",
      details: [
        "Welcome new members warmly",
        "Avoid exclusionary behavior",
        "Support diversity in all its forms",
        "Help others feel valued and heard"
      ]
    },
    {
      id: 3,
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Communicate Clearly",
      description: "Share information in a helpful and constructive way.",
      details: [
        "Provide accurate event information",
        "Be clear and concise in your messages",
        "Ask questions if you need clarification",
        "Share feedback constructively"
      ]
    },
    {
      id: 4,
      icon: <Shield className="w-6 h-6" />,
      title: "Maintain Safety",
      description: "Keep the community safe and secure for everyone.",
      details: [
        "Report suspicious or harmful behavior",
        "Protect personal information",
        "Don't share sensitive event details publicly",
        "Follow event safety protocols"
      ]
    },
    {
      id: 5,
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Avoid Spam",
      description: "Keep the platform free from unwanted content.",
      details: [
        "Don't post repetitive content",
        "Avoid excessive self-promotion",
        "No unsolicited advertisements",
        "Stay on topic in discussions"
      ]
    },
    {
      id: 6,
      icon: <Flag className="w-6 h-6" />,
      title: "Report Issues",
      description: "Help us maintain a positive community.",
      details: [
        "Report violations promptly",
        "Provide detailed information",
        "Don't take matters into your own hands",
        "Trust the moderation process"
      ]
    }
  ];

  const toggleSection = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    setActiveSection(activeSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Community Guidelines</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Welcome to Cruise! Our community guidelines help create a safe, respectful, and enjoyable environment for all members.
          </p>
        </div>
      </div>

      
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
     
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At Cruise, we believe in building a community where everyone feels welcome, safe, and valued. These guidelines are here to help us achieve that goal together.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By participating in our platform, you agree to follow these guidelines and help us maintain a positive environment for all users.
          </p>
        </div>

        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {guidelines.map((guideline) => (
            <div
              key={guideline.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleSection(guideline.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 flex-shrink-0">
                    {guideline.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {guideline.title}
                    </h3>
                    <p className="text-gray-600">{guideline.description}</p>
                  </div>
                </div>
              </button>
              
              {activeSection === guideline.id && (
                <div className="px-6 pb-6 pt-2 bg-gray-50 border-t border-gray-100">
                  <ul className="space-y-2">
                    {guideline.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

     
        <div className="bg-red-50 rounded-xl border border-red-200 p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold text-red-900 mb-2">Prohibited Content</h2>
              <p className="text-red-800 mb-4">
                The following types of content are strictly prohibited on Cruise:
              </p>
            </div>
          </div>
          <ul className="space-y-2 ml-9">
            <li className="text-red-900">• Hate speech, discrimination, or harassment</li>
            <li className="text-red-900">• Violence, threats, or dangerous activities</li>
            <li className="text-red-900">• Illegal activities or content</li>
            <li className="text-red-900">• Spam, scams, or fraudulent behavior</li>
            <li className="text-red-900">• Impersonation or misleading information</li>
            <li className="text-red-900">• Inappropriate or explicit content</li>
          </ul>
        </div>

      
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Enforcement</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Violations of these guidelines may result in:
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-2">Warning</h3>
              <p className="text-sm text-yellow-800">First-time minor violations</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">Suspension</h3>
              <p className="text-sm text-orange-800">Repeated or serious violations</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">Ban</h3>
              <p className="text-sm text-red-800">Severe or repeated violations</p>
            </div>
          </div>
        </div>

       
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Thank you for being part of the Cruise community! Together, we can create amazing events and memorable experiences.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 2026
          </p>
        </div>
      </div>
    </div>
  );
}