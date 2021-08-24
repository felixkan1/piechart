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
      let dataArray = newDatasets[0].data;

      //need to decrease the other slider values
      let total = dataArray.reduce((a, c) => a + c, 0);
      let remaining = 100 - value;
      //3) subtract evenly from sliders that are not 0
      //case difference > 100

      //need to decrease the other sliders

      const nonZeroSliders = dataArray
        .filter((n, index) => index !== sliderIndex)
        .filter((n, index) => n !== 0).length;

      const increaseOtherSliders =
        dataArray[sliderIndex] > value ? true : false;

      for (let i = 0; i < dataArray.length; i++) {
        if (i === sliderIndex) {
          dataArray[i] = value;
        } else if (dataArray[i] !== 0) {
          const newVal = remaining / nonZeroSliders;
          dataArray[i] = newVal;
        } else if (increaseOtherSliders) {
          const newVal = remaining / nonZeroSliders;
          dataArray[i] = newVal;
        }
      }

      console.log(dataArray);

      // if (total !== 100) {
      //   adjustSliders(difference, dataArray, sliderIndex);
      //   total = dataArray.reduce((a, c) => a + c, 0);
      // }

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
