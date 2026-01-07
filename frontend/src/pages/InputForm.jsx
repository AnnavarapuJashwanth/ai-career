import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CloudUpload,
  ArrowForward,
  ArrowBack,
  CheckCircle,
  Error as ErrorIcon,
  Code,
  Storage,
  Layers,
  Analytics,
  Psychology,
  Construction,
  PhoneAndroid,
  BugReport,
  Cloud,
  Support,
  Palette,
  Inventory,
  AccountTree,
  Business,
  Groups,
  Description,
  TrendingUp,
  Science,
  Biotech,
  Architecture,
  Engineering,
  Factory,
  LocalHospital,
  MedicalServices,
  School,
  MenuBook,
  Nature,
  Spa,
  WbSunny
} from '@mui/icons-material';
import { useResumeAnalysis } from '../hooks/useResumeAnalysis';
import { useRoadmapGeneration } from '../hooks/useRoadmapGeneration';
import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import api from '../utils/api';

const TARGET_ROLES = [
  // SOFTWARE & IT ROLES
  { 
    name: 'Frontend Developer', 
    sector: 'Software & IT',
    icon: Code,
    gradient: 'from-blue-600 via-cyan-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    description: 'Build stunning user interfaces'
  },
  { 
    name: 'Backend Developer', 
    sector: 'Software & IT',
    icon: Storage,
    gradient: 'from-purple-600 via-violet-500 to-indigo-500',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    description: 'Create powerful server systems'
  },
  { 
    name: 'Full Stack Developer', 
    sector: 'Software & IT',
    icon: Layers,
    gradient: 'from-orange-600 via-red-500 to-pink-500',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    description: 'Master both frontend & backend'
  },
  { 
    name: 'Data Scientist', 
    sector: 'Software & IT',
    icon: Analytics,
    gradient: 'from-emerald-600 via-green-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    description: 'Analyze data, build ML models'
  },
  { 
    name: 'ML Engineer', 
    sector: 'Software & IT',
    icon: Psychology,
    gradient: 'from-indigo-600 via-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    description: 'Deploy AI/ML solutions'
  },
  { 
    name: 'DevOps Engineer', 
    sector: 'Software & IT',
    icon: Construction,
    gradient: 'from-yellow-600 via-orange-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=600&fit=crop',
    description: 'Automate deployment pipelines'
  },
  { 
    name: 'Mobile Developer', 
    sector: 'Software & IT',
    icon: PhoneAndroid,
    gradient: 'from-pink-600 via-rose-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    description: 'Build iOS & Android apps'
  },
  { 
    name: 'Cloud Architect', 
    sector: 'Software & IT',
    icon: Cloud,
    gradient: 'from-sky-600 via-blue-500 to-indigo-500',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    description: 'Design cloud infrastructure'
  },

  // ENGINEERING ROLES
  { 
    name: 'Chemical Engineer', 
    sector: 'Engineering',
    icon: Science,
    gradient: 'from-green-600 via-teal-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop',
    description: 'Design chemical processes & plants'
  },
  { 
    name: 'Civil Engineer', 
    sector: 'Engineering',
    icon: Architecture,
    gradient: 'from-slate-600 via-gray-500 to-zinc-500',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
    description: 'Design infrastructure & buildings'
  },
  { 
    name: 'Mechanical Engineer', 
    sector: 'Engineering',
    icon: Engineering,
    gradient: 'from-orange-600 via-amber-500 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop',
    description: 'Design mechanical systems'
  },
  { 
    name: 'Electrical Engineer', 
    sector: 'Engineering',
    icon: Factory,
    gradient: 'from-blue-600 via-indigo-500 to-purple-500',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop',
    description: 'Design electrical systems'
  },
  { 
    name: 'Environmental Engineer', 
    sector: 'Engineering',
    icon: Nature,
    gradient: 'from-lime-600 via-green-500 to-emerald-500',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&h=600&fit=crop',
    description: 'Solve environmental challenges'
  },

  // HEALTHCARE & MEDICAL ROLES
  { 
    name: 'Medical Doctor', 
    sector: 'Healthcare',
    icon: LocalHospital,
    gradient: 'from-red-600 via-rose-500 to-pink-500',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    description: 'Diagnose & treat patients'
  },
  { 
    name: 'Registered Nurse', 
    sector: 'Healthcare',
    icon: MedicalServices,
    gradient: 'from-blue-600 via-cyan-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    description: 'Provide patient care'
  },
  { 
    name: 'Pharmacist', 
    sector: 'Healthcare',
    icon: Biotech,
    gradient: 'from-purple-600 via-violet-500 to-fuchsia-500',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=600&fit=crop',
    description: 'Dispense medications & advise'
  },
  { 
    name: 'Clinical Psychologist', 
    sector: 'Healthcare',
    icon: Psychology,
    gradient: 'from-indigo-600 via-blue-500 to-sky-500',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop',
    description: 'Provide mental health therapy'
  },
  { 
    name: 'Medical Lab Technician', 
    sector: 'Healthcare',
    icon: Science,
    gradient: 'from-emerald-600 via-teal-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=600&fit=crop',
    description: 'Conduct medical laboratory tests'
  },

  // EDUCATION ROLES
  { 
    name: 'High School Teacher', 
    sector: 'Education',
    icon: School,
    gradient: 'from-amber-600 via-orange-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop',
    description: 'Teach secondary education'
  },
  { 
    name: 'University Professor', 
    sector: 'Education',
    icon: MenuBook,
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
    description: 'Research & teach higher education'
  },
  { 
    name: 'Education Administrator', 
    sector: 'Education',
    icon: AccountTree,
    gradient: 'from-blue-600 via-indigo-500 to-purple-500',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop',
    description: 'Manage educational institutions'
  },
  { 
    name: 'Curriculum Developer', 
    sector: 'Education',
    icon: Description,
    gradient: 'from-teal-600 via-cyan-500 to-blue-500',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop',
    description: 'Design educational programs'
  },

  // AGRICULTURE ROLES
  { 
    name: 'Agricultural Scientist', 
    sector: 'Agriculture',
    icon: Science,
    gradient: 'from-green-600 via-lime-500 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
    description: 'Research crop & livestock improvement'
  },
  { 
    name: 'Farm Manager', 
    sector: 'Agriculture',
    icon: Spa,
    gradient: 'from-emerald-600 via-green-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop',
    description: 'Oversee farm operations'
  },
  { 
    name: 'Agricultural Engineer', 
    sector: 'Agriculture',
    icon: Engineering,
    gradient: 'from-lime-600 via-green-500 to-emerald-500',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
    description: 'Design agricultural machinery'
  },
  { 
    name: 'Soil Scientist', 
    sector: 'Agriculture',
    icon: WbSunny,
    gradient: 'from-amber-600 via-yellow-500 to-lime-500',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
    description: 'Study soil composition & health'
  },

  // BUSINESS & MANAGEMENT ROLES
  { 
    name: 'UI/UX Designer', 
    sector: 'Business & Management',
    icon: Palette,
    gradient: 'from-fuchsia-600 via-pink-500 to-rose-500',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    description: 'Design beautiful experiences'
  },
  { 
    name: 'Product Manager', 
    sector: 'Business & Management',
    icon: Inventory,
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    description: 'Drive product strategy'
  },
  { 
    name: 'Project Manager', 
    sector: 'Business & Management',
    icon: AccountTree,
    gradient: 'from-amber-600 via-yellow-500 to-orange-500',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    description: 'Lead project execution'
  },
  { 
    name: 'Business Analyst', 
    sector: 'Business & Management',
    icon: Business,
    gradient: 'from-blue-600 via-indigo-500 to-purple-500',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    description: 'Analyze business needs'
  },
];

export default function InputForm() {
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [step, setStep] = useState(1);
  const [prefilledSkills, setPrefilledSkills] = useState([]);
  const [hasLatestAnalysis, setHasLatestAnalysis] = useState(false);
  const [inputMode, setInputMode] = useState(''); // 'upload', 'paste', or 'no-resume'

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

  useEffect(() => {
    const discoveryRole = routerLocation.state?.discoveredRole;
    if (discoveryRole) {
      setTargetRole(discoveryRole);
      setStep(2);
      setInputMode('no-resume');
      toast.success(`Loaded ${discoveryRole} from Role Discovery`);
    }
  }, [routerLocation.state?.discoveredRole]);

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
      // Clear old analysis data before analyzing new resume
      setPrefilledSkills([]);
      const result = await analyze(resumeText);
      console.log('Analysis result:', result);
      if (result?.skills) {
        setPrefilledSkills(result.skills);
      }
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
      // Use the latest analysis data - prioritize analysisData from recent analysis
      const skillsToUse = analysisData?.skills || prefilledSkills || [];
      console.log('Generating roadmap with skills:', skillsToUse);
      console.log('Target role:', targetRole);
      console.log('Experience:', experience);
      console.log('Location:', location);
      
      if (!skillsToUse || skillsToUse.length === 0) {
        toast.warning('No skills extracted. Please ensure your resume was properly analyzed.');
      }
      
      const roadmapData = await generate({
        current_skills: skillsToUse,
        resume_text: resumeText,
        target_role: targetRole,
        years_of_experience: Number(experience) || 0,
        location: location || '',
      });
      
      console.log('Roadmap generated:', roadmapData);
      
      // Save roadmap for the user
      try {
        const api = (await import('../utils/api')).default;
        await api.post('/roadmaps/save', roadmapData);
      } catch {}
      
      // Pass correct current skills to dashboard
      navigate('/dashboard', { 
        state: { 
          roadmap: roadmapData, 
          role: targetRole, 
          location, 
          currentSkills: skillsToUse,  // Use the actual extracted skills
          analysisData: analysisData   // Also pass analysisData directly
        } 
      });
    } catch (err) {
      console.error('Error generating roadmap:', err);
      toast.error('Failed to generate roadmap. Please try again.');
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-6 sm:py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all text-gray-700 hover:text-blue-600 font-medium"
          >
            <ArrowBack fontSize="small" />
            <span>Back to Dashboard</span>
          </button>
        </div>
        
        {/* Progress indicator with enhanced styling */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-6 sm:mb-8 relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full">
              <div 
                className={`h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out ${
                  step >= 2 ? 'w-full' : 'w-1/2'
                }`}
              ></div>
            </div>

            {[1, 2].map((num) => (
              <div key={num} className="relative z-10">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg transition-all duration-300 transform ${
                    step >= num
                      ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white scale-110 shadow-lg shadow-purple-500/50'
                      : 'bg-white text-gray-400 border-2 border-gray-300'
                  }`}
                >
                  {step > num ? <CheckCircle style={{ fontSize: window.innerWidth < 640 ? 20 : 24 }} /> : num}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs sm:text-sm font-semibold px-2">
            <span className={`transition-colors ${step >= 1 ? 'text-purple-600' : 'text-gray-500'}`}>📄 Upload Resume</span>
            <span className={`transition-colors ${step >= 2 ? 'text-purple-600' : 'text-gray-500'}`}>🎯 Select Role</span>
          </div>
        </div>

        {/* Step 1: Resume Upload */}
        {step === 1 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-10 border border-white shadow-2xl shadow-purple-500/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                How would you like to proceed?
              </h2>
              <p className="text-gray-600 text-lg">Choose the best option that works for you</p>
            </div>

            {hasLatestAnalysis && (
              <div className="mb-8 flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="text-sm text-blue-800 font-medium">We found your last analysis. Want to use it?</div>
                </div>
                <button
                  type="button"
                  onClick={() => { setStep(2); toast.success('Loaded last analysis skills'); }}
                  className="px-5 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Use Previous
                </button>
              </div>
            )}

            {!inputMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Option 1: Upload Resume */}
                <button
                  onClick={() => setInputMode('upload')}
                  className="group relative overflow-hidden p-8 border-3 border-blue-200 rounded-2xl hover:border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 cursor-pointer text-center transform hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-cyan-400/0 group-hover:from-blue-400/10 group-hover:to-cyan-400/10 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-xl">
                      <CloudUpload style={{ fontSize: 40 }} className="text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Upload Resume</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Upload PDF, DOCX, or TXT file</p>
                    <div className="mt-4 inline-flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                      Choose File <ArrowForward style={{ fontSize: 16 }} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Option 2: Paste Resume */}
                <button
                  onClick={() => setInputMode('paste')}
                  className="group relative overflow-hidden p-8 border-3 border-green-200 rounded-2xl hover:border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 cursor-pointer text-center transform hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-emerald-400/0 group-hover:from-green-400/10 group-hover:to-emerald-400/10 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-xl">
                      <span className="text-5xl">📝</span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Paste Resume</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Copy and paste your resume text</p>
                    <div className="mt-4 inline-flex items-center text-green-600 font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                      Paste Text <ArrowForward style={{ fontSize: 16 }} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Option 3: No Resume */}
                <button
                  onClick={() => {
                    setInputMode('no-resume');
                    setStep(2);
                    toast.info('Please select your target role');
                  }}
                  className="group relative overflow-hidden p-8 border-3 border-purple-200 rounded-2xl hover:border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 cursor-pointer text-center transform hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-pink-400/0 group-hover:from-purple-400/10 group-hover:to-pink-400/10 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-xl">
                      <span className="text-5xl">🎯</span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">No Resume</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">I know my target role</p>
                    <div className="mt-4 inline-flex items-center text-purple-600 font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                      Continue <ArrowForward style={{ fontSize: 16 }} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* Option 4: Discover My Role - NEW */}
                <button
                  onClick={() => navigate('/role-discovery')}
                  className="group relative overflow-hidden p-8 border-3 border-orange-200 rounded-2xl hover:border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-300 cursor-pointer text-center transform hover:scale-105 hover:shadow-2xl shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-amber-400/0 group-hover:from-orange-400/10 group-hover:to-amber-400/10 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-xl">
                      <span className="text-5xl">🧠</span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">Discover My Role</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Take a quiz to find your path</p>
                    <div className="mt-4 inline-flex items-center text-orange-600 font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                      Start Quiz <ArrowForward style={{ fontSize: 16 }} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* Upload Resume Section */}
            {inputMode === 'upload' && (
              <>
                <button
                  onClick={() => setInputMode('')}
                  className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  <span className="text-xl">←</span> Back to options
                </button>
                <div className="mb-8">
                  <label htmlFor="resume-upload" className="block">
                    <div className="relative border-3 border-dashed border-blue-300 rounded-2xl p-12 sm:p-16 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 group bg-gradient-to-br from-blue-50/30 to-cyan-50/30">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-cyan-400/0 group-hover:from-blue-400/5 group-hover:to-cyan-400/5 rounded-2xl transition-all duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex justify-center mb-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-xl">
                            <CloudUpload style={{ fontSize: 40 }} className="text-white" />
                          </div>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                          {window.innerWidth < 640 ? 'Tap to upload resume' : 'Drag and drop your resume'}
                        </p>
                        <p className="text-gray-600 text-sm sm:text-base mb-4">
                          PDF, DOCX, or TXT • Works on mobile & desktop
                        </p>
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform group-hover:scale-105">
                          <CloudUpload style={{ fontSize: 20 }} />
                          Choose File
                        </div>
                      </div>
                    </div>
                    <input
                      id="resume-upload"
                      type="file"
                      className="hidden"
                      onChange={handleResumeUpload}
                      accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    />
                  </label>
                </div>
              </>
            )}

            {/* Paste Resume Section */}
            {inputMode === 'paste' && (
              <>
                <button
                  onClick={() => setInputMode('')}
                  className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  <span className="text-xl">←</span> Back to options
                </button>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-3xl">📝</span>
                    Paste your resume here
                  </h3>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    className="w-full h-64 p-6 border-2 border-green-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all bg-gradient-to-br from-green-50/30 to-emerald-50/30 text-gray-900 placeholder-gray-400 shadow-lg"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      {resumeText.length} characters
                    </p>
                    {resumeText.length > 100 && (
                      <span className="text-sm font-semibold text-green-600">✓ Looking good!</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleAnalyzeResume}
                  disabled={analyzing || !resumeText.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl shadow-lg transition-all transform hover:scale-105 disabled:transform-none"
                >
                  {analyzing ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Continue <ArrowForward style={{ fontSize: 20 }} />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 2: Role Selection */}
        {step === 2 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-10 border border-white shadow-2xl shadow-purple-500/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Select Your Target Role
              </h2>
              <p className="text-gray-600 text-lg">Choose the career path you're aiming for</p>
            </div>

            {/* Roles by Sector */}
            {['Software & IT', 'Engineering', 'Healthcare', 'Education', 'Agriculture', 'Business & Management'].map((sector) => {
              const sectorRoles = TARGET_ROLES.filter(r => r.sector === sector);
              if (sectorRoles.length === 0) return null;
              
              const sectorIcons = {
                'Software & IT': <Code className="text-blue-600" style={{ fontSize: 32 }} />,
                'Engineering': <Engineering className="text-orange-600" style={{ fontSize: 32 }} />,
                'Healthcare': <LocalHospital className="text-red-600" style={{ fontSize: 32 }} />,
                'Education': <School className="text-amber-600" style={{ fontSize: 32 }} />,
                'Agriculture': <Nature className="text-green-600" style={{ fontSize: 32 }} />,
                'Business & Management': <Business className="text-purple-600" style={{ fontSize: 32 }} />
              };

              return (
                <div key={sector} className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    {sectorIcons[sector]} {sector}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectorRoles.map((role) => (
                      <button
                        key={role.name}
                        type="button"
                        onClick={() => setTargetRole(role.name)}
                        className={`group relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                          targetRole === role.name
                            ? 'ring-4 ring-blue-500 scale-105 shadow-2xl'
                            : 'hover:ring-2 hover:ring-blue-300'
                        }`}
                      >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <img 
                            src={role.image} 
                            alt={role.name}
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-80 group-hover:opacity-70 transition-opacity`}></div>
                          <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10 p-8 text-left h-48 flex flex-col justify-between">
                          <div>
                            <role.icon style={{ fontSize: 48 }} className="text-white mb-3 drop-shadow-lg" />
                            <h4 className="text-xl font-bold text-white mb-2">{role.name}</h4>
                            <p className="text-white/90 text-base">{role.description}</p>
                          </div>
                          
                          {targetRole === role.name && (
                            <div className="flex items-center gap-2 text-white">
                              <CheckCircle style={{ fontSize: 20 }} />
                              <span className="font-semibold">Selected</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Shine Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:animate-shimmer"></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">💼</span> Years of Experience
                </label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  min="0"
                  max="50"
                  placeholder="0"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all bg-gradient-to-br from-purple-50/30 to-pink-50/30 text-gray-900 font-semibold shadow-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">📍</span> Location (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., San Francisco, Remote"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all bg-gradient-to-br from-purple-50/30 to-pink-50/30 text-gray-900 shadow-lg"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-4 rounded-xl font-bold border-3 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all transform hover:scale-105 shadow-lg"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleGenerateRoadmap}
                disabled={generating || !targetRole}
                className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl shadow-lg transition-all transform hover:scale-105 disabled:transform-none"
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Roadmap <ArrowForward style={{ fontSize: 20 }} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
