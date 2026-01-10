import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Person, Email, Work, LocationOn, School, CalendarToday, Save } from '@mui/icons-material';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Sidebar from '../components/common/Sidebar';
import api from '../utils/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_role: '',
    target_role: '',
    years_of_experience: '',
    location: '',
    education: '',
    skills: [],
    career_goals: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please log in to view your profile');
        return;
      }

      const response = await api.get('/auth/me');
      setUser(response.data);
      
      // Populate form with existing data
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        current_role: response.data.current_role || '',
        target_role: response.data.target_role || '',
        years_of_experience: response.data.years_of_experience || '',
        location: response.data.location || '',
        education: response.data.education || '',
        skills: response.data.skills || [],
        career_goals: response.data.career_goals || '',
        linkedin_url: response.data.linkedin_url || '',
        github_url: response.data.github_url || '',
        portfolio_url: response.data.portfolio_url || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please log in to save your profile');
        return;
      }

      await api.put('/auth/profile', formData);
      toast.success('Profile updated successfully!');
      setUser(prev => ({ ...prev, ...formData }));
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('careerai_user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
        <Sidebar user={user} onSignOut={handleSignOut} />
        
        <main className="relative z-10 flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          <Header />
          
          <div className="max-w-4xl mx-auto mt-8">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold backdrop-blur-sm">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : <Person style={{ fontSize: 48 }} />}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{formData.name || 'Your Name'}</h1>
                  <p className="text-white/90">{formData.current_role || 'Your Current Role'}</p>
                  <p className="text-white/80 text-sm mt-1">{formData.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Name */}
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                    <Person style={{ fontSize: 20 }} /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                    <Email style={{ fontSize: 20 }} /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
                  />
                </div>

                {/* Current Role */}
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                    <Work style={{ fontSize: 20 }} /> Current Role
                  </label>
                  <input
                    type="text"
                    name="current_role"
                    value={formData.current_role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Frontend Developer"
                  />
                </div>

                {/* Target Role */}
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                    <Work style={{ fontSize: 20 }} /> Target Role
                  </label>
                  <input
                    type="text"
                    name="target_role"
                    value={formData.target_role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Full Stack Developer"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                    <CalendarToday style={{ fontSize: 20 }} /> Years of Experience
                  </label>
                  <input
                    type="number"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="3"
                    min="0"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                    <LocationOn style={{ fontSize: 20 }} /> Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="San Francisco, CA"
                  />
                </div>

                {/* Education */}
                <div className="md:col-span-2">
                  <label className="block text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                    <School style={{ fontSize: 20 }} /> Education
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="B.S. Computer Science, Stanford University"
                  />
                </div>

                {/* Career Goals */}
                <div className="md:col-span-2">
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Career Goals
                  </label>
                  <textarea
                    name="career_goals"
                    value={formData.career_goals}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe your short-term and long-term career aspirations..."
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                {/* GitHub */}
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                {/* Portfolio */}
                <div className="md:col-span-2">
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    name="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save style={{ fontSize: 24 }} />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
          
          <Footer />
        </main>
      </div>
    </>
  );
}
