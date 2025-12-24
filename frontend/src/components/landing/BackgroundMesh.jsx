import React from 'react';

export default function BackgroundMesh() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-fuchsia-400/20 to-sky-400/20 blur-3xl" />
    </div>
  );
}
