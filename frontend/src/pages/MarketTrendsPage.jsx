import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';
import MarketTrendsBar from '../components/cards/MarketTrendsBar';
import { useMarketTrends } from '../hooks/useMarketTrends';
import api from '../utils/api';
import AIChatbot from '../components/AIChatbot';

export default function MarketTrendsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('careerai_user') || '{"email":"sravanthivarikuti233@gmail.com","name":"Sravanthivarikuti"}');
  const { fetch: fetchTrends, data: trendsData } = useMarketTrends();
  const [userRole, setUserRole] = useState('Data Scientist');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user's actual target role and market trends
  useEffect(() => {
    const fetchUserRoleAndTrends = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/roadmaps/latest');
        if (response.data && response.data.target_role) {
          setUserRole(response.data.target_role);
          // Fetch trends immediately without waiting
          fetchTrends(response.data.target_role, '').catch(err => {
            console.log('Market trends error:', err);
          });
        } else {
          // Fallback to default
          fetchTrends('Data Scientist', '').catch(err => {
            console.log('Market trends error:', err);
          });
        }
      } catch (error) {
        console.log('Using default role: Data Scientist');
        // Still try to fetch trends
        fetchTrends('Data Scientist', '').catch(err => {
          console.log('Market trends error:', err);
        });
      } finally {
        // Don't wait for trends to finish
        setIsLoading(false);
      }
    };
    fetchUserRoleAndTrends();
  }, [fetchTrends]);
  
  const handleSignOut = () => {
    localStorage.removeItem('careerai_logged_in');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Enhanced Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <motion.div
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-3xl"
        />
      </div>

      <Sidebar user={user} onSignOut={handleSignOut} />
      <main className="relative z-10 flex-1 p-8 overflow-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-transparent bg-clip-text flex items-center gap-4 mb-3">
            <span className="text-6xl">📈</span>
            Market Insights
          </h1>
          <p className="text-gray-400 text-lg">
            {isLoading ? 'Loading...' : `Real-time job market trends for ${userRole} - Updated daily`}
          </p>
        </motion.div>

        {/* Main Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-3xl p-10 border-2 border-white/20 shadow-2xl mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Job Market Demand</h2>
              <p className="text-gray-400">{isLoading ? 'Loading...' : `Monthly trends for ${userRole} roles`}</p>
            </div>
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-semibold">
              Updated Daily
            </div>
          </div>
          <MarketTrendsBar trends={trendsData?.trending_skills || []} role={userRole} />
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Job Openings', 
              value: trendsData?.job_openings ? trendsData.job_openings.toLocaleString() : (isLoading ? 'Loading...' : '15,234'), 
              icon: '💼', 
              color: 'from-blue-500 to-cyan-500' 
            },
            { 
              label: 'Avg Salary', 
              value: trendsData?.avg_salary ? `$${Math.round(trendsData.avg_salary / 1000)}K` : (isLoading ? 'Loading...' : '$120K'), 
              icon: '💰', 
              color: 'from-green-500 to-emerald-500' 
            },
            { 
              label: 'Growth Rate', 
              value: trendsData?.growth_rate ? `+${trendsData.growth_rate}%` : (isLoading ? 'Loading...' : '+28%'), 
              icon: '📊', 
              color: 'from-purple-500 to-pink-500' 
            },
            { 
              label: 'Remote Jobs', 
              value: trendsData?.remote_percentage ? `${trendsData.remote_percentage}%` : (isLoading ? 'Loading...' : '68%'), 
              icon: '🏠', 
              color: 'from-orange-500 to-red-500' 
            }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/20"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} text-transparent bg-clip-text mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Top Skills in Demand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/20 shadow-2xl mb-8"
        >
          <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">🔥</span>
            Top Skills in Demand
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { skill: 'Python', demand: 95, color: 'bg-blue-500' },
              { skill: 'Machine Learning', demand: 90, color: 'bg-purple-500' },
              { skill: 'SQL', demand: 85, color: 'bg-cyan-500' },
              { skill: 'Cloud (AWS/Azure)', demand: 82, color: 'bg-orange-500' },
              { skill: 'Deep Learning', demand: 78, color: 'bg-pink-500' },
              { skill: 'Data Visualization', demand: 75, color: 'bg-green-500' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + idx * 0.05 }}
                className="bg-white/5 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold">{item.skill}</span>
                  <span className="text-cyan-400 font-bold">{item.demand}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.demand}%` }}
                    transition={{ duration: 1, delay: 0.8 + idx * 0.05 }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Industry Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-blue-900/40 backdrop-blur-2xl rounded-3xl p-10 border-2 border-purple-500/30 shadow-2xl"
        >
          <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="text-4xl">💡</span>
            Industry Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-400/30 shadow-xl"
            >
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🏢</span>
                Top Hiring Companies
              </h4>
              <ul className="space-y-3">
                {(trendsData?.top_companies || ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple']).map((company, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className="text-white/90 flex items-center gap-3 text-base"
                  >
                    <span className="text-yellow-400 text-lg">⭐</span> 
                    <span className="font-medium">{company}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-emerald-400/30 shadow-xl"
            >
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📍</span>
                Fastest Growing Locations
              </h4>
              <ul className="space-y-3">
                {(trendsData?.top_locations || ['San Francisco, CA', 'Seattle, WA', 'New York, NY', 'Austin, TX', 'Boston, MA']).map((location, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1 }}
                    className="text-white/90 flex items-center gap-3 text-base"
                  >
                    <span className="text-green-400 text-lg">📍</span> 
                    <span className="font-medium">{location}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
