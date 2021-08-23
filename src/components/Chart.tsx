import React, { useEffect, useState, useReducer } from 'react';
import { Pie } from 'react-chartjs-2';
import { Sliders } from './Sliders';
import { getInitialChartData } from '../chartConfigs/chartInitialData';
import { chartData } from '../interface/interfaces';
import './Chart.css';
import { getChartOptions } from '../chartConfigs/chartOptions';

const initialState: chartData = getInitialChartData();
const dataReducer = (state: chartData = initialState, action: any) => {
  switch (action.type) {
    case 'get initial data': {
      return {
        ...state,
      };
    }
    case 'change slider':
      const { slider, value } = action;
      const newDatasets = [...state.data.datasets];
      newDatasets[0].data[slider] = value;
      return {
        ...state,
        data: {
          ...state.data,
          datasets: newDatasets,
        },
      };
  }
};

export const Chart: React.FC = () => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <div className="chart">
      {state && <Pie data={state.data} options={getChartOptions()} />}
      {state && <Sliders chartData={state.data} dispatch={dispatch} />}
    </div>
  );
};

export const MemoizedChart = React.memo(Chart);
