import React, { useState, useEffect } from 'react';
import './Sliders.css';
import { chartData } from '../interface/interfaces';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';


interface Props {
  chartData: chartData['data'];
  dispatch: any;
}

export const Sliders: React.FC<Props> = ({ chartData, dispatch }) => {
  const [total, setTotal] = React.useState<number | number[]>(0);

  useEffect(() => {
    setTotal(chartData.datasets[0].data.reduce((a, b) => a + b, 0));
  }, [chartData]);

  const handleChange = (event: any, newValue: number | number[]) => {
    const slider = event.target.ariaLabel;
    if (!slider) {
      return;
    } else {
      dispatch({
        type: 'change slider',
        sliderIndex: parseInt(slider),
        value: newValue,
      });
    }
  };

  return (
    <div className="sliders">
      <div className="total">{total}</div>
      {chartData.labels.map((label, index) => (
        <div className="slider">
          <Typography id="range-slider" gutterBottom>
            {label}
          </Typography>
          <Slider
            value={chartData.datasets[0].data[index]}
            min={0}
            step={1}
            max={100}
            onChange={handleChange}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
            aria-label={String(index)}
          />
        </div>
      ))}
    </div>
  );
};
