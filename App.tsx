import React from 'react';

const App = () => {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <div className="w-16 h-1 border-t-2 border-slate-800 animate-pulse"></div>
      <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">Project Cleared</p>
    </div>
  );
};

export default App;