import React, { useState, useEffect } from 'react';
import Candidate1 from '@/assets/images/all-img/candidate1.png';
import { Icon } from '@iconify/react';

export default function AIInterviewUI() {
  const [currentTime, setCurrentTime] = useState("15:30");
  const [isRecording, setIsRecording] = useState(true);

  // Simulate time update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => {
        const [min, sec] = prev.split(':').map(Number);
        const newSec = sec + 1 >= 60 ? 0 : sec + 1;
        const newMin = sec + 1 >= 60 ? min + 1 : min;
        return `${newMin.toString().padStart(2, '0')}:${newSec.toString().padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const candidateData = {
    name: "Jane Doe",
    status: "Active",
    recording: "On",
    aiStatus: "Listening & Analyzing Candidate Response...",
    scores: {
      communication: 85,
      technical: 92,
      problemSolving: 88,
      adaptability: 80
    },
    summary: "Candidate demonstrated strong understanding of React and TypeScript by detailing work on a real-time dashboard. Highlighted use of hooks, context API, and type safety. Articulated effective performance optimization strategies, including memoization, debouncing, and immutable state management.",
    conversation: [
      {
        speaker: "AI Interviewer",
        message: "Excellent. Can you elaborate on a specific challenge you faced during this project and how you overcame it using a problem-solving approach?",
        isAI: true
      },
      {
        speaker: "Candidate",
        message: "We implemented 'React.memo' and 'useCallback' for component and function memoization. For data updates, we debounced and throttled API calls, and used 'immer' to manage immutable state efficiently, minimizing re-renders.",
        isAI: false
      },
      {
        speaker: "AI Interviewer",
        message: "That sounds interesting. How did you handle performance optimizations, particularly with frequent data updates in a real-time environment?",
        isAI: true
      },
      {
        speaker: "Candidate",
        message: "Certainly. At my previous role, I led the development of a real-time dashboard. I used React hooks for state management and context API for global data, ensuring type safety with TypeScript.",
        isAI: false
      },
      {
        speaker: "AI Interviewer",
        message: "Welcome! We'll start with some questions about your experience. Can you tell me about a project where you implemented a new feature using React and TypeScript?",
        isAI: true
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Candidate Video */}
        <div className="space-y-6">
          {/* Candidate Video Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Video/Image Area */}
            <div className="relative bg-gray-200 aspect-[4/3]">
              <img 
                src={Candidate1}
                alt="Candidate"
                className="w-full h-full object-cover"
              />
              
              {/* Bottom Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center justify-between text-black-500">
                  <div>
                    <div className="font-medium">{candidateData.name}</div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span>{candidateData.status}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{candidateData.recording}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4 p-4 bg-white border-t">
              <button className="p-3 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button className="p-3 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-3 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors">
                End Interview
              </button>
            </div>
          </div>

          {/* Conversation Log */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="text-sm font-medium text-gray-500 mb-4">Conversation</div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {candidateData.conversation.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.isAI ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <span className="text-sm">{msg.isAI ? 'AI' : 'JD'}</span>
                  </div>
                  <div className={`flex-1 ${msg.isAI ? 'text-left' : 'text-right'}`}>
                    <div className={`inline-block max-w-full px-4 py-2 rounded-lg text-sm ${
                      msg.isAI 
                        ? 'bg-blue-50 text-gray-800' 
                        : 'bg-green-50 text-gray-800'
                    }`}>
                      <div className="font-medium text-xs mb-1 opacity-70">{msg.speaker}</div>
                      <div>{msg.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Status and Scoring */}
        <div className="space-y-6">
          {/* Current AI Status */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="text-sm font-medium text-gray-500 mb-2">Current AI Status</div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
               <Icon icon="heroicons:cpu-chip" className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-sm mt-2 text-indigo-600 leading-relaxed">
                {candidateData.aiStatus}
              </div>
            </div>
          </div>

          {/* Real-time Scoring */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="text-sm font-medium text-gray-500 mb-4">Real-time Scoring</div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Communication", score: candidateData.scores.communication, icon: "💬" },
                { label: "Technical Skills", score: candidateData.scores.technical, icon: "🎓" },
                { label: "Problem Solving", score: candidateData.scores.problemSolving, icon: "💡" },
                { label: "Adaptability", score: candidateData.scores.adaptability, icon: "📈" }
              ].map((item, idx) => (
                <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-xs text-gray-600 mb-1">{item.label}</div>
                  <div className="text-2xl font-bold text-purple-600">{item.score}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-Generated Summary */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="text-sm font-medium text-gray-500 mb-3">Auto-Generated Summary</div>
            <div className="text-sm text-gray-700 leading-relaxed">
              {candidateData.summary}
            </div>
          </div>

            {/* AI Interviewer Section - Below Video */}
          {/* <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🤖</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">AI Interviewer</div>
                <div className="text-sm text-gray-500">Automated Interview Assistant</div>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              {candidateData.conversation.filter(c => c.isAI).reverse().map((msg, idx) => (
                <div key={idx} className="pb-4 border-b last:border-b-0">
                  <div className="font-medium text-blue-600 mb-1">{msg.speaker}:</div>
                  <div>{msg.message}</div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}