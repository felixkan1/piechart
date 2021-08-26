import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './Sliders.css';
import { chartData } from '../interface/interfaces';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TextField from '@material-ui/core/TextField';
import { CirclePicker } from 'react-color';

interface Props {
  chartData: chartData['data'];
  dispatch: any;
  lockedSliders: number[];
}

export const Sliders: React.FC<Props> = ({
  chartData,
  dispatch,
  lockedSliders,
}) => {
  const [total, setTotal] = useState<number>(0);
  const [newLabelValue, setNewLabelValue] = useState<string>('');
  const [newColour, setNewColour] = useState<string>('');

  useEffect(() => {
    setTotal(chartData.datasets[0].data.reduce((a, b) => a + b, 0));
  }, [chartData]);

  const handleSliderChange = (event: any, newValue: number | number[]) => {
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

  const handleTextChange = (event: any) => {
    const value = event.target.value;
    if (value.length <= 15) {
      setNewLabelValue(event.target.value);
    } else {
      setNewLabelValue(event.target.value.slice(0, 15));
    }
  };

  const handleLock = (index: number) => {
    dispatch({
      type: 'toggle lock slider',
      index: index,
    });
  };

  const handleAddLabel = (event: any) => {
    dispatch({
      type: 'add slider',
      label: newLabelValue,
      colour: newColour,
    });

    setNewLabelValue('');
  };

  return (
    <div className="sliders">
      <div className="total">Total: {Math.round(total)}</div>
      {chartData.labels.map((label, index) => (
        <div className="sliders">
          <Typography id="range-slider" gutterBottom>
            {label}
          </Typography>
          <div className="slider">
            <Slider
              value={chartData.datasets[0].data[index]}
              min={0}
              step={0.01}
              max={100}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              valueLabelFormat={(x) => x.toFixed(1)}
              aria-labelledby="non-linear-slider"
              aria-label={String(index)}
              disabled={
                lockedSliders.includes(index) ||
                chartData.labels.length - lockedSliders.length === 1
              }
            />
            <input type="checkbox" onClick={() => handleLock(index)} />
          </div>
        </div>
      ))}
      <div className="add-label">
        <div className="label-button">
          <IconButton
            aria-label="delete"
            onClick={handleAddLabel}
            disabled={!newColour || !newLabelValue}
          >
            <AddCircleIcon />
          </IconButton>
          <TextField
            id="standard-basic"
            label="Label"
            onChange={handleTextChange}
            value={newLabelValue}
            size={'small'}
            margin={'dense'}
          />
        </div>
        <CirclePicker
          color={newColour}
          onChangeComplete={(color) => setNewColour(color.hex)}
        />
      </div>
    </div>
  );
};
