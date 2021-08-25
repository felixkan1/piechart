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
      const { label, colour } = action;
      console.log(label, colour);
      return {
        ...state,
      };
    }
    case 'change slider': {
      const { sliderIndex, value } = action;
      const newDatasets = [...state.data.datasets];
      let dataArray = newDatasets[0].data;

      let remaining = 100 - value;

      const nonZeroSliders = dataArray
        .filter((val, index) => index !== sliderIndex)
        .filter((val, index) => val !== 0).length;

      const increaseOtherSliders =
        dataArray[sliderIndex] > value ? true : false;

      for (let i = 0; i < dataArray.length; i++) {
        if (i === sliderIndex) {
          dataArray[i] = value;
        } else if (dataArray[i] !== 0 || increaseOtherSliders) {
          dataArray[i] = remaining / nonZeroSliders;
        }
      }

      return {
        ...state,
        data: {
          ...state.data,
          datasets: newDatasets,
        },
      };
    }
    case 'add slider': {
      const { colour, label } = action;
      const newDatasets = [...state.data.datasets];

      const dataArray = newDatasets[0].data;
      const colourArray = newDatasets[0].backgroundColor;

      dataArray.push(0);
      colourArray.push(colour);

      return {
        ...state,
        data: {
          ...state.data,
          labels: [...state.data.labels, label],
          datasets: newDatasets,
        },
      };
    }
    case 'lock slider': {
      const { index } = action;
    }
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
