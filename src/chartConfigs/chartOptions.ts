export const getChartOptions = () => {
  return {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        intersect: false,
        mode: 'nearest',
      },
    },
    animation: {
      duration: 0,
    },
  };
};
