import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

const AreaChart = ({ dataKey, titulo, data, xtitulo, ytitulo}) => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    series: [{
      name: 'Series1',
      data: []
    }],
    chart: {
      id: 'area-chart',
      type: 'area',
    },
    yaxis: {
      title: {
        text: 'Values',
      },
    },
    title: {
      text: 'Diagrama de Área',
      align: 'center',
    },
    fill: {
      opacity: 0.3, 
    },
    stroke: {
      curve: 'smooth', 
    },
    colors: ["#0db939"],
  });

  useEffect(() => {
    if (data && data[dataKey]) {
      const dataForKey = data[dataKey]; 
      const categories = Object.keys(dataForKey); 
      const values = Object.values(dataForKey); 
      const mediana = values.map(innerArray => innerArray[2]);
      console.log("Values:", values)
      console.log(mediana)
      console.log(categories)
      const numericCategories = categories.map((category, index) => index);

      setChartData([{
        name: titulo,
        data: mediana,
      }]);

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          categories: numericCategories,
          title: { text: xtitulo },
          labels: {
            show: false,
            formatter: function (value, index) {
              return categories[index] || value; 
            },
          },
        },
        tooltip: {
          ...prevOptions.tooltip,
          x: {
            show: true,
            formatter: function (value) {
              return categories[value] || value; 
            },
          },
          y: {
            formatter: function (value) {
              return `Mediana: ${value}`; 
            },
          },
        },
        title: {
          text: titulo, 
          align: 'center',
        },
        yaxis: { title: { text: ytitulo } },
        colors: ["#0db939"],
      }));
    }
  }, [data]);

  console.log(chartData)

  return (
    <div>
      <ApexCharts
        options={chartOptions}
        series={chartData}
        type="area"
        height={350}
      />
    </div>
  );
};

export default AreaChart;
