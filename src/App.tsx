import React from 'react';
import './App.css';

import { MemoizedChart } from './components/Chart';

const App: React.FC = () => {
  return (
    <div>
      <MemoizedChart />
    </div>
  );
};

export default App;
