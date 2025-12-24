import React, { useEffect } from 'react';

export default function CareerGuidanceCursor() {
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.id = 'career-cursor';
    cursor.style.position = 'fixed';
    cursor.style.zIndex = '9999';
    cursor.style.pointerEvents = 'none';
    cursor.style.width = '36px';
    cursor.style.height = '36px';
    cursor.style.borderRadius = '50%';
    cursor.style.background = 'rgba(99,102,241,0.18)';
    cursor.style.border = '2px solid #6366f1';
    cursor.style.boxShadow = '0 2px 16px 0 #6366f1cc';
    cursor.style.transition = 'transform 0.15s cubic-bezier(.17,.67,.83,.67)';
    cursor.style.display = 'flex';
    cursor.style.alignItems = 'center';
    cursor.style.justifyContent = 'center';
    cursor.innerHTML = '<span class="material-icons" style="color:#2563eb;font-size:22px;">trending_up</span>';
    document.body.appendChild(cursor);

    const move = (e) => {
      cursor.style.transform = `translate3d(${e.clientX - 18}px,${e.clientY - 18}px,0)`;
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      cursor.remove();
    };
  }, []);
  return null;
}
