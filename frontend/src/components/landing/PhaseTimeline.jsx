import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';

const TAG_META = {
  'Node.js': {
    label: 'Node.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  },
  Express: {
    label: 'Express',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  },
  'REST APIs': {
    label: 'REST APIs',
  },
  PostgreSQL: {
    label: 'PostgreSQL',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  },
  MongoDB: {
    label: 'MongoDB',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  },
  Python: {
    label: 'Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  },
  Pandas: {
    label: 'Pandas',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
  },
  'Scikit-Learn': {
    label: 'Scikit-Learn',
  },
  'PyTorch': {
    label: 'PyTorch',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
  },
  Keras: {
    label: 'Keras',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg',
  },
  Docker: {
    label: 'Docker',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  },
  AWS: {
    label: 'AWS',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
  },
  FastAPI: {
    label: 'FastAPI',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  },
};

const ROLE_PHASES = {
  Backend: [
    {
      title: 'Backend Fundamentals',
      desc: 'Master Node.js and Express to build robust APIs.',
      weeks: 4,
      tags: ['Node.js', 'Express', 'REST APIs'],
      active: true,
      courses: [
        { title: 'Node.js Intro', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/learn-node-js/', weeks: 1 },
        { title: 'Express Basics', provider: 'MDN', url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs', weeks: 1 },
        { title: 'REST APIs with Postman', provider: 'YouTube', url: 'https://www.youtube.com/results?search_query=rest+api+postman+tutorial', weeks: 1 },
        { title: 'Auth & JWT', provider: 'Blog', url: 'https://jwt.io/introduction', weeks: 1 },
      ],
      cta: 'Start Learning',
    },
    {
      title: 'Database Mastery',
      desc: 'Learn SQL (PostgreSQL) and NoSQL (MongoDB) design patterns.',
      weeks: 3,
      tags: ['PostgreSQL', 'MongoDB', 'Indexing'],
      locked: true,
      courses: [
        { title: 'SQL for Devs', provider: 'Khan Academy', url: 'https://www.khanacademy.org/computing/computer-programming/sql', weeks: 1 },
        { title: 'Postgres Basics', provider: 'Supabase', url: 'https://supabase.com/docs/guides/database', weeks: 1 },
        { title: 'MongoDB Essentials', provider: 'MongoDB', url: 'https://www.mongodb.com/developer/learn/', weeks: 1 },
      ],
    },
    {
      title: 'System Architecture',
      desc: 'Understand microservices, caching, and scalability.',
      weeks: 5,
      tags: ['Microservices', 'Caching', 'Queues'],
      locked: true,
      courses: [
        { title: 'System Design Primer', provider: 'GitHub', url: 'https://github.com/donnemartin/system-design-primer', weeks: 2 },
        { title: 'Caches & Queues', provider: 'Blog', url: 'https://redis.io/docs/latest/develop/', weeks: 1 },
        { title: 'Async Messaging', provider: 'RabbitMQ', url: 'https://www.rabbitmq.com/tutorials', weeks: 2 },
      ],
    },
    {
      title: 'Cloud Deployment',
      desc: 'Deploy and manage applications on AWS.',
      weeks: 4,
      tags: ['AWS', 'CI/CD', 'Docker'],
      locked: true,
      courses: [
        { title: 'Docker Basics', provider: 'Docker', url: 'https://docs.docker.com/get-started/', weeks: 1 },
        { title: 'CI/CD with GitHub Actions', provider: 'Docs', url: 'https://docs.github.com/actions', weeks: 1 },
        { title: 'AWS Elastic Beanstalk', provider: 'AWS', url: 'https://docs.aws.amazon.com/elasticbeanstalk/', weeks: 2 },
      ],
    },
  ],
  'Data Science': [
    {
      title: 'Python & Data Wrangling',
      desc: 'Numpy, Pandas, data cleaning, EDA.',
      weeks: 4,
      tags: ['Python', 'Pandas', 'EDA'],
      active: true,
      courses: [
        { title: 'Numpy + Pandas', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/python-for-data-science-course/', weeks: 2 },
        { title: 'EDA Playbook', provider: 'Kaggle', url: 'https://www.kaggle.com/learn/data-visualization', weeks: 2 },
      ],
      cta: 'Start Learning',
    },
    {
      title: 'ML Fundamentals',
      desc: 'Regression, classification, model selection.',
      weeks: 5,
      tags: ['Scikit-Learn', 'Metrics', 'Pipelines'],
      locked: true,
      courses: [
        { title: 'ML Crash Course', provider: 'Google', url: 'https://developers.google.com/machine-learning/crash-course', weeks: 3 },
        { title: 'Sklearn Guide', provider: 'Docs', url: 'https://scikit-learn.org/stable/user_guide.html', weeks: 2 },
      ],
    },
    {
      title: 'Deep Learning',
      desc: 'Neural networks and training basics.',
      weeks: 4,
      tags: ['PyTorch', 'Keras', 'CNNs'],
      locked: true,
      courses: [
        { title: 'DL Specialization', provider: 'Coursera', url: 'https://www.coursera.org/specializations/deep-learning', weeks: 4 },
      ],
    },
    {
      title: 'MLOps Basics',
      desc: 'Experiment tracking, deployment, and monitoring.',
      weeks: 3,
      tags: ['MLflow', 'FastAPI', 'Docker'],
      locked: true,
      courses: [
        { title: 'FastAPI for ML', provider: 'Docs', url: 'https://fastapi.tiangolo.com/', weeks: 1 },
        { title: 'MLflow Guide', provider: 'Docs', url: 'https://mlflow.org/docs/latest/index.html', weeks: 2 },
      ],
    },
  ],
};

export default function PhaseTimeline() {
  const [role, setRole] = useState('Backend');
  const phases = useMemo(() => ROLE_PHASES[role], [role]);

  return (
    <section id="timeline" className="max-w-5xl mx-auto my-16 px-4">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h3 className="text-2xl font-extrabold text-gray-900">Your Personalized Roadmap</h3>
        <div className="bg-white/80 rounded-xl shadow p-1 flex gap-1">
          {Object.keys(ROLE_PHASES).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${role === r ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-blue-200" />
        <div className="space-y-4">
          {phases.map((p, i) => {
            const active = !!p.active;
            const locked = !!p.locked;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`relative rounded-xl border p-5 ${active ? 'bg-white shadow-md border-blue-200' : 'bg-white/70 border-gray-200'} ${locked ? 'opacity-70' : ''}`}
              >
                <div className={`absolute -left-4 top-6 w-6 h-6 rounded-full flex items-center justify-center ${active ? 'bg-white border-2 border-blue-500' : 'bg-white border-2 border-gray-300'}`}>
                  {locked ? (
                    <LockRoundedIcon className="text-gray-400" style={{ fontSize: 16 }} />
                  ) : (
                    <span className={`w-3 h-3 rounded-full ${active ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  )}
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className={`text-lg font-bold ${active ? 'text-gray-900' : 'text-gray-600'}`}>{p.title}</h4>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${active ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                        {p.weeks} weeks
                      </span>
                    </div>
                    <p className={`mt-1 ${active ? 'text-gray-700' : 'text-gray-500'}`}>{p.desc}</p>

                    {p.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.tags.map(tag => {
                          const meta = TAG_META[tag] || { label: tag };
                          return (
                            <span
                              key={tag}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${active ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500 border border-gray-200'} flex items-center gap-1`}
                            >
                              {meta.icon && (
                                <img src={meta.icon} alt={meta.label} className="w-3.5 h-3.5" />
                              )}
                              <span>{meta.label}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {p.courses?.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {p.courses.map(c => (
                          <a key={c.title} href={c.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white hover:border-blue-300 hover:shadow px-3 py-2">
                            <div>
                              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 flex items-center gap-1">
                                {c.title}
                                <OpenInNewRoundedIcon style={{ fontSize: 14 }} />
                              </div>
                              <div className="text-xs text-gray-500">{c.provider}</div>
                            </div>
                            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5">{c.weeks}w</span>
                          </a>
                        ))}
                      </div>
                    )}

                    {p.cta && (
                      <button className="mt-3 inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline">
                        <PlayArrowRoundedIcon /> {p.cta}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
