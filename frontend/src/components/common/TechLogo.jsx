import React from 'react';

/**
 * Tech Stack Logo Icons with SVG paths
 * Real logos for HTML5, CSS3, JavaScript, React, Node.js, SQL, Cloud
 */
export const TechLogos = {
  HTML5: ({ size = 40, className = '' }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }} title="HTML5">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.56L16.07 16.43L16.62 10.33H9.38L9.2 8.3H16.8L17 6.31H7L7.56 12.32H14.45L14.22 14.9L12 15.5L9.78 14.9L9.64 13.24H7.64L7.93 16.43L12 17.56Z" fill="#E34F26"/>
        <path d="M4.07 3L5.53 20.41L12 22L18.47 20.41L19.93 3H4.07Z" stroke="#E34F26" strokeWidth="0.5" fill="none"/>
      </svg>
    </div>
  ),

  CSS3: ({ size = 40, className = '' }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }} title="CSS3">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.56L7.93 16.43L7.64 13.24H9.64L9.78 14.9L12 15.5L14.22 14.9L14.45 12.32H7.56L7 6.31H17L16.8 8.3H9.2L9.38 10.33H16.62L16.07 16.43L12 17.56Z" fill="#1572B6"/>
        <path d="M4.07 3L5.53 20.41L12 22L18.47 20.41L19.93 3H4.07Z" stroke="#1572B6" strokeWidth="0.5" fill="none"/>
      </svg>
    </div>
  ),

  JavaScript: ({ size = 40, className = '' }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }} title="JavaScript">
      <svg viewBox="0 0 24 24" fill="#F7DF1E" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" fill="#F7DF1E"/>
        <path d="M12.5 16.5V18.5H10.5V16.5C10.5 15.4 11.4 14.5 12.5 14.5C13.6 14.5 14.5 15.4 14.5 16.5Z" fill="#000"/>
        <path d="M14.5 12.5H12.5V8.5H14.5V12.5Z" fill="#000"/>
        <text x="7" y="17" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#000">JS</text>
      </svg>
    </div>
  ),

  React: ({ size = 40, className = '' }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }} title="React">
      <svg viewBox="-11.5 -10.23 23 20.46" fill="#61DAFB" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </svg>
    </div>
  ),

  NodeJS: ({ size = 40, className = '' }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }} title="Node.js">
      <svg viewBox="0 0 24 24" fill="#339933" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.55.26 1.05.4 1.56.4 1.06 0 1.67-.65 1.67-1.78V8.84c0-.13-.1-.23-.23-.23h-1c-.12 0-.23.1-.23.23v8.15c0 .38-.39.76-.98.76-.25 0-.53-.07-.77-.18l-1.86-1.07c-.11-.07-.18-.18-.18-.3V7.71c0-.12.07-.24.18-.3l7.44-4.3c.11-.06.25-.06.35 0l7.44 4.3c.11.06.18.18.18.3v8.58c0 .12-.07.24-.18.3l-7.44 4.3c-.11.06-.24.06-.35 0l-1.89-1.09c-.08-.05-.19-.06-.28-.02-.45.2-.54.23-.96.33-.1.03-.26.08.01.23l2.46 1.42c.24.13.5.2.78.2.28 0 .54-.07.78-.2l7.44-4.3c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2z"/>
      </svg>
    </div>
  ),

  SQL: ({ size = 40, className = '' }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }} title="SQL">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#00758F" strokeWidth="2" fill="#00758F" opacity="0.2"/>
        <rect x="3" y="5" width="18" height="3" fill="#00758F"/>
        <circle cx="6" cy="6.5" r="0.5" fill="white"/>
        <circle cx="8" cy="6.5" r="0.5" fill="white"/>
        <circle cx="10" cy="6.5" r="0.5" fill="white"/>
        <text x="7" y="15" fontFamily="monospace" fontSize="6" fontWeight="bold" fill="#00758F">SQL</text>
      </svg>
    </div>
  ),

  Docker: ({ size = 40, className = '' }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }} title="Docker">
      <svg viewBox="0 0 24 24" fill="#2496ED" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 10.5h2v2h-2v-2zm-3 0h2v2h-2v-2zm-3 0h2v2h-2v-2zm6-3h2v2h-2v-2zm-3 0h2v2h-2v-2zm-3 0h2v2h-2v-2zm-3 0h2v2h-2v-2zm9 6h2v2h-2v-2z"/>
        <path d="M21.8 11.2c-.4-.3-1.4-.4-2.1-.2-.1-.7-.6-1.3-1.2-1.7l-.4-.2-.3.4c-.4.6-.6 1.4-.5 2.2.1.4.3.8.6 1.1-.3.2-.7.3-1.1.3H3.5c-.3 0-.5.2-.5.5 0 1.6.4 3.1 1.3 4.4 1 1.4 2.5 2.1 4.5 2.1 4.3 0 7.5-2 9.2-5.8 1.1 0 2.3-.2 3.1-1 .1-.1.3-.2.4-.4l.2-.3-.2-.3c-.6-.7-1.6-1-2.7-1.1z"/>
      </svg>
    </div>
  ),

  AWS: ({ size = 40, className = '' }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }} title="AWS">
      <svg viewBox="0 0 24 24" fill="#FF9900" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.76 10.17c0 .4.04.72.11.98.08.26.19.54.34.84.06.1.08.2.08.28 0 .12-.08.24-.23.36l-.77.51c-.11.08-.23.11-.32.11-.13 0-.25-.06-.38-.19-.15-.16-.28-.33-.38-.5-.1-.18-.21-.38-.32-.62-.81.96-1.83 1.44-3.06 1.44-.87 0-1.57-.25-2.08-.74-.51-.49-.77-1.15-.77-1.97 0-.87.31-1.58.93-2.11.62-.53 1.45-.8 2.49-.8.35 0 .71.03 1.1.08.39.05.79.13 1.21.21v-.71c0-.74-.15-1.25-.46-1.55-.32-.3-.86-.45-1.63-.45-.35 0-.71.04-1.08.13-.37.08-.73.18-1.08.3-.16.06-.28.1-.35.11-.07.02-.13.03-.16.03-.14 0-.21-.1-.21-.31v-.49c0-.16.02-.28.07-.35.05-.07.14-.14.29-.21.35-.18.77-.33 1.27-.45.5-.13 1.03-.19 1.59-.19 1.21 0 2.1.28 2.66.83.55.55.83 1.39.83 2.52v3.32zm-4.23 1.58c.34 0 .69-.06 1.06-.19.37-.13.7-.34.98-.64.17-.19.3-.39.37-.62.07-.23.12-.49.12-.8v-.39c-.31-.06-.63-.1-.97-.14-.34-.03-.67-.05-.99-.05-.7 0-1.22.14-1.54.43-.32.29-.48.69-.48 1.21 0 .5.13.87.38 1.13.25.27.61.4 1.07.4zm8.38 1.13c-.18 0-.3-.03-.38-.1-.08-.06-.15-.2-.22-.4l-2.45-8.05c-.07-.24-.11-.39-.11-.47 0-.19.09-.29.28-.29h1.14c.19 0 .32.03.39.1.08.06.14.2.21.4l1.75 6.9 1.62-6.9c.06-.24.13-.37.2-.4.08-.06.22-.1.4-.1h.93c.19 0 .32.03.4.1.08.06.15.2.21.4l1.64 6.99 1.8-6.99c.07-.24.14-.37.22-.4.08-.06.21-.1.38-.1h1.08c.19 0 .29.09.29.29 0 .06-.01.11-.03.18-.02.07-.05.16-.1.29l-2.51 8.05c-.07.24-.14.37-.22.4-.08.06-.21.1-.39.1h-1c-.19 0-.32-.03-.4-.1-.08-.07-.15-.2-.21-.41l-1.61-6.7-1.6 6.69c-.06.24-.13.37-.21.41-.08.07-.22.1-.4.1h-1zm13.32.43c-.54 0-1.07-.06-1.59-.19-.52-.13-.93-.27-1.21-.43-.16-.09-.27-.19-.31-.29-.04-.1-.06-.21-.06-.32v-.51c0-.21.08-.31.23-.31.06 0 .12.01.18.03.06.02.15.06.27.11.37.16.76.28 1.17.36.42.08.83.12 1.25.12.66 0 1.17-.12 1.53-.35.36-.23.54-.57.54-1.01 0-.3-.09-.55-.28-.75-.19-.21-.54-.4-1.06-.58l-1.52-.48c-.77-.24-1.33-.6-1.69-1.07-.36-.47-.54-1-.54-1.58 0-.46.1-.86.3-1.21.2-.35.47-.66.81-.91.34-.26.73-.45 1.18-.58.45-.13.93-.19 1.44-.19.23 0 .47.01.71.04.24.03.47.07.69.12.21.05.42.11.61.17.19.07.35.14.47.21.13.08.23.17.29.27.06.1.09.22.09.36v.47c0 .21-.08.32-.23.32-.09 0-.23-.04-.43-.13-.65-.3-1.38-.45-2.18-.45-.6 0-1.07.1-1.41.31-.34.21-.51.52-.51.94 0 .3.1.56.31.76.21.21.59.41 1.14.61l1.49.48c.76.24 1.31.58 1.65 1.02.34.44.51.95.51 1.52 0 .47-.1.89-.29 1.26-.19.37-.46.69-.81.96-.35.27-.76.48-1.24.62-.49.15-1.02.22-1.59.22z"/>
      </svg>
    </div>
  ),

  Cloud: ({ size = 40, className = '' }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }} title="Cloud">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4"/>
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-2.89 0-5.4 1.64-6.65 4.04C2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="url(#cloud-gradient)" opacity="0.7"/>
        <defs>
          <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4"/>
            <stop offset="100%" stopColor="#34A853"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  ),

  TypeScript: ({ size = 40, className = '' }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }} title="TypeScript">
      <svg viewBox="0 0 24 24" fill="#3178C6" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" fill="#3178C6"/>
        <path d="M11.5 8.5h-4v1h1.5v6h1v-6h1.5v-1zm3.5 0v7h1v-2.5h1.5c.8 0 1.5-.7 1.5-1.5v-1.5c0-.8-.7-1.5-1.5-1.5h-2.5zm1 1h1.5c.3 0 .5.2.5.5v1.5c0 .3-.2.5-.5.5H16v-2.5z" fill="white"/>
      </svg>
    </div>
  ),

  Python: ({ size = 40, className = '' }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }} title="Python">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.42 3.35-3.42h5.766s3.24.052 3.24-3.148V3.202S18.28 0 11.914 0zM8.708 1.85c.578 0 1.046.47 1.046 1.052 0 .581-.468 1.051-1.046 1.051-.579 0-1.046-.47-1.046-1.051 0-.582.467-1.052 1.046-1.052z" fill="url(#python-gradient1)"/>
        <path d="M12.087 24c6.092 0 5.712-2.656 5.712-2.656l-.007-2.752h-5.814v-.826h8.123s3.9.445 3.9-5.735c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.42-3.35 3.42H9.452s-3.24-.052-3.24 3.148v5.292S5.72 24 12.087 24zm3.206-1.85c-.578 0-1.046-.47-1.046-1.052 0-.581.468-1.051 1.046-1.051.579 0 1.046.47 1.046 1.051 0 .582-.467 1.052-1.046 1.052z" fill="url(#python-gradient2)"/>
        <defs>
          <linearGradient id="python-gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#387EB8"/>
            <stop offset="100%" stopColor="#366994"/>
          </linearGradient>
          <linearGradient id="python-gradient2" x1="100%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE873"/>
            <stop offset="100%" stopColor="#FFC331"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  ),
};

/**
 * Tech Logo Component
 * Usage: <TechLogo name="React" size={48} />
 */
export default function TechLogo({ name, size = 40, className = '' }) {
  // Normalize skill name to match logo keys
  const normalizedName = name?.trim();
  
  // Try exact match first
  let LogoComponent = TechLogos[normalizedName];
  
  // Try common variations
  if (!LogoComponent) {
    const lowerName = normalizedName?.toLowerCase();
    if (lowerName?.includes('html')) LogoComponent = TechLogos.HTML5;
    else if (lowerName?.includes('css')) LogoComponent = TechLogos.CSS3;
    else if (lowerName?.includes('javascript') || lowerName === 'js') LogoComponent = TechLogos.JavaScript;
    else if (lowerName?.includes('react')) LogoComponent = TechLogos.React;
    else if (lowerName?.includes('node')) LogoComponent = TechLogos.NodeJS;
    else if (lowerName?.includes('typescript') || lowerName === 'ts') LogoComponent = TechLogos.TypeScript;
    else if (lowerName?.includes('python')) LogoComponent = TechLogos.Python;
    else if (lowerName?.includes('sql') || lowerName?.includes('database')) LogoComponent = TechLogos.SQL;
    else if (lowerName?.includes('docker')) LogoComponent = TechLogos.Docker;
    else if (lowerName?.includes('aws') || lowerName?.includes('cloud') || lowerName?.includes('azure')) LogoComponent = TechLogos.AWS;
  }
  
  if (!LogoComponent) {
    // Fallback: colorful badge with initials
    const initials = normalizedName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
    const colors = ['bg-blue-600', 'bg-purple-600', 'bg-pink-600', 'bg-green-600', 'bg-orange-600', 'bg-cyan-600'];
    const colorIndex = normalizedName?.charCodeAt(0) % colors.length || 0;
    
    return (
      <div
        className={`flex items-center justify-center ${colors[colorIndex]} rounded-lg shadow-md ${className}`}
        style={{ width: size, height: size }}
        title={normalizedName}
      >
        <span className="text-xs font-bold text-white">{initials}</span>
      </div>
    );
  }

  return <LogoComponent size={size} className={className} />;
}

/**
 * Tech Stack Row Component
 * Displays multiple tech logos in a row
 */
export function TechStackRow({ techs = [], size = 40, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {techs.map((tech, index) => (
        <TechLogo key={index} name={tech} size={size} />
      ))}
    </div>
  );
}
