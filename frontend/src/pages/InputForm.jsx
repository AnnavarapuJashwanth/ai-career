import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CloudUpload,
  ArrowForward,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { useRoadmapGeneration } from '../hooks/useRoadmapGeneration';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TARGET_ROLES = [
  'Full Stack Developer',
  'Data Scientist',
  'Cloud Engineer',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Frontend Developer',
  'Backend Developer',
  'AI Engineer',
  'Cybersecurity Specialist',
  'System Architect',
];

export default function InputForm() {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [step, setStep] = useState(1);
  const [prefilledSkills, setPrefilledSkills] = useState([]);
  const [hasLatestAnalysis, setHasLatestAnalysis] = useState(false);

  const { analyze, loading: analyzing, data: analysisData } = useResumeAnalysis();
  const { generate, loading: generating } = useRoadmapGeneration();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    api.get('/analyses/latest')
      .then(({ data }) => {
        if (data?.skills?.length) {
          setPrefilledSkills(data.skills);
          setHasLatestAnalysis(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if it's a PDF
    if (file.type === 'application/pdf') {
      // Upload PDF to backend for processing
      const formData = new FormData();
      formData.append('file', file);
      
      toast.info('📄 Processing PDF...');
      
      try {
        const token = localStorage.getItem('authToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const response = await api.post('/upload_resume', formData, {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Auto-analyze after successful upload
        if (response.data) {
          setPrefilledSkills(response.data.skills || []);
          toast.success('✅ Resume analyzed successfully!');
          setStep(2);
        }
      } catch (err) {
        console.error('PDF upload error:', err);
        toast.error('Failed to process PDF. Please try again or paste text.');
      }
    } else {
      // Handle text files
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result);
        toast.success('✅ Resume uploaded!');
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) {
      toast.error('Please upload or paste your resume');
      return;
    }
    if (!localStorage.getItem('authToken')) {
      toast.info('Please log in to analyze your resume.');
      return;
    }
    try {
      await analyze(resumeText);
      setStep(2);
    } catch (err) {
      console.error('Error analyzing resume:', err);
      toast.error('Failed to analyze resume. Please try again.');
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!targetRole) {
      toast.error('Please select a target role');
      return;
    }
    if (!localStorage.getItem('authToken')) {
      toast.info('Please log in to generate your roadmap.');
      return;
    }
    try {
      const roadmapData = await generate({
        current_skills: analysisData?.skills || prefilledSkills || [],
        resume_text: resumeText,
        target_role: targetRole,
        years_of_experience: Number(experience) || 0,
        location: location || '',
      });
      // Save roadmap for the user
      try {
        const api = (await import('../utils/api')).default;
        await api.post('/roadmaps/save', roadmapData);
      } catch {}
      navigate('/dashboard', { state: { roadmap: roadmapData, role: targetRole, location, currentSkills: analysisData?.skills || [] } });
    } catch (err) {
      console.error('Error generating roadmap:', err);
      toast.error('Failed to generate roadmap. Please try again.');
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress indicator */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            {[1, 2].map((num) => (
              <React.Fragment key={num}>
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-base sm:text-lg transition transform ${
                    step >= num
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-110'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step > num ? <CheckCircle style={{ fontSize: window.innerWidth < 640 ? 20 : 24 }} /> : num}
                </div>
                {num < 2 && (
                  <div
                    className={`flex-1 h-1 mx-2 sm:mx-4 transition ${
                      step > num ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between text-xs sm:text-sm font-semibold px-2">
            <span className={step >= 1 ? 'text-blue-600' : 'text-gray-500'}>Upload Resume</span>
            <span className={step >= 2 ? 'text-blue-600' : 'text-gray-500'}>Select Role</span>
          </div>
        </div>

        {/* Step 1: Resume Upload */}
        {step === 1 && (
          <div className="card-shadow bg-white rounded-lg p-6 sm:p-8 border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Step 1: Upload Your Resume</h2>

            {hasLatestAnalysis && (
              <div className="mb-6 flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-sm text-blue-800 font-medium">We found your last analysis. Use it to skip upload?</div>
                <button
                  type="button"
                  onClick={() => { setStep(2); toast.success('Loaded last analysis skills'); }}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Use last analysis
                </button>
              </div>
            )}

            {/* Resume Upload Area */}
            <div className="mb-8">
              <label className="block">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 sm:p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition duration-300">
                  <div className="flex justify-center mb-2">
                    <CloudUpload style={{ fontSize: 48 }} className="text-blue-500" />
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {window.innerWidth < 640 ? 'Tap to upload resume' : 'Drag and drop your resume'}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    PDF, DOCX, or TXT • Works on mobile & desktop
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleResumeUpload}
                    accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    capture="environment"
                  />
                </div>
              </label>
            </div>

            {/* Paste Resume Option */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Or paste your resume here:</h3>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Character count */}
            <p className="text-sm text-gray-500 mb-8">
              {resumeText.length} characters
            </p>

            {/* Next Button */}
            <button
              onClick={handleAnalyzeResume}
              disabled={analyzing || !resumeText.trim()}
              className="w-full btn-gradient py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition transform hover:scale-105"
            >
              {analyzing ? 'Analyzing...' : 'Continue'} <ArrowForward />
            </button>
          </div>
        )}

        {/* Step 2: Role Selection */}
        {step === 2 && (
          <div className="card-shadow bg-white rounded-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Step 2: Select Your Target Role</h2>
            <p className="text-gray-600 mb-8">Choose the career role you're aiming for</p>

            {/* Role Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {TARGET_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTargetRole(role)}
                  className={`p-4 rounded-lg border-2 transition font-semibold hover:scale-105 ${
                    targetRole === role
                      ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-900 shadow-md'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-blue-300'
                  }`}
                >
                  {targetRole === role && <CheckCircle style={{ fontSize: 16, marginRight: 8 }} />}
                  {role}
                </button>
              ))}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  min="0"
                  max="50"
                  placeholder="0"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Location (Optional)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., San Francisco, Remote"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 rounded-lg font-bold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition hover:scale-105"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleGenerateRoadmap}
                disabled={generating || !targetRole}
                className="flex-1 btn-gradient py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition transform hover:scale-105"
              >
                {generating ? 'Generating...' : 'Generate Roadmap'} <ArrowForward />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
