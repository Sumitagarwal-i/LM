import React from "react";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import './App.css';

const App = () => {
  return (
    <div
      style={{ height: '100vh', overflowY: 'auto', background: '#000', WebkitOverflowScrolling: 'touch' }}
    >
      <Analytics />
      <SpeedInsights/>
    </div>
  );
};

export default App;
