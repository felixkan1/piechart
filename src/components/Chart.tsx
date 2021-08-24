import React, { useReducer } from 'react';
import { Pie } from 'react-chartjs-2';
import { Sliders } from './Sliders';
import { getInitialChartData } from '../chartConfigs/chartInitialData';
import { chartData } from '../interface/interfaces';
import { getChartOptions } from '../chartConfigs/chartOptions';
import './Chart.css';

const initialState: chartData = getInitialChartData();

const adjustSliders = (
  difference: number,
  dataArray: number[],
  sliderIndex: number
) => {
  if (difference > 0) {
    for (let i = difference; i >= 0; i--) {
      let index = i % dataArray.length;
      if (index === sliderIndex || dataArray[index] === 0) {
        continue;
      }
      dataArray[index]--;
      difference--;
    }
  } else if (difference < 0) {
    difference *= -1;
    for (let i = difference; i >= 0; i--) {
      let index = i % dataArray.length;
      if (index === sliderIndex || dataArray[index] === 100) {
        continue;
      }
      dataArray[index]++;
      difference++;
    }
  }
};
const dataReducer = (state: chartData = initialState, action: any) => {
  switch (action.type) {
    case 'get initial data': {
      return {
        ...state,
      };
    }
    case 'change slider':
      const { sliderIndex, value } = action;
      const newDatasets = [...state.data.datasets];
      const dataArray = newDatasets[0].data;
      dataArray[sliderIndex] = value;
      //need to decrease the other slider values
      let total = dataArray.reduce((a, c) => a + c, 0);
      let difference = total - 100;
      //3) subtract evenly from sliders that are not 0
      //case difference > 100

      //need to decrease the other sliders
      if (total !== 100) {
        adjustSliders(difference, dataArray, sliderIndex);
        total = dataArray.reduce((a, c) => a + c, 0);
      }


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
