import React, { useReducer, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Sliders } from './Sliders';
import { getInitialChartData } from '../chartConfigs/chartInitialData';
import { chartData } from '../interface/interfaces';
import { getChartOptions } from '../chartConfigs/chartOptions';
import './Chart.css';

const initialState: chartData = getInitialChartData();

const dataReducer = (state: chartData = initialState, action: any) => {
  switch (action.type) {
    case 'get initial data': {
      return {
        ...state,
      };
    }
    case 'change slider': {
      const { sliderIndex, value } = action;
      const newDatasets = [...state.data.datasets];
      let dataArray = newDatasets[0].data;

      let remaining = 100 - value;

      dataArray.map((val, index) => {
        if (state.locked.includes(index)) {
          remaining -= val;
        }
      });

      const remainingSliders = dataArray.filter(
        (val, index) =>
          index !== sliderIndex && val !== 0 && !state.locked.includes(index)
      ).length;

      const increaseOtherSliders =
        dataArray[sliderIndex] > value ? true : false;

      for (let i = 0; i < dataArray.length; i++) {
        if (i === sliderIndex) {
          dataArray[i] = value;
        } else if (
          (dataArray[i] !== 0 || increaseOtherSliders) &&
          !state.locked.includes(i)
        ) {
          dataArray[i] = remaining / remainingSliders;
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
    case 'toggle lock slider': {
      const { index } = action;
      let lockedList = [...state.locked];
      if (lockedList.includes(index)) {
        lockedList = lockedList.filter((sliderIndex) => sliderIndex != index);
      } else {
        lockedList.push(index);
      }
      return {
        ...state,
        locked: lockedList,
      };
    }
  }
};

export const Chart: React.FC = () => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <div className="chart">
      {state && <Pie data={state.data} options={getChartOptions()} />}
      {state && (
        <Sliders
          chartData={state.data}
          dispatch={dispatch}
          lockedSliders={state.locked}
        />
      )}
    </div>
  );
};

export const MemoizedChart = React.memo(Chart);
