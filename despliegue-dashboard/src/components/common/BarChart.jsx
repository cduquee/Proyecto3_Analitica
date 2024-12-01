import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

const BarChart = ({dataKey, titulo, data}) => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: 'bar-chart',
      type: 'bar',
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      title: {
        text: 'Values'
      },
    },
    title: {
      text: 'Diagrama de Barras',
      align: 'center',
    },
    plotOptions: {
      bar: {
        borderRadius: 20,
        borderRadiusApplication: 'both',
        horizontal: true,
      },
      
    }

  });

  useEffect(() => {
    if (data && data[dataKey]) {
      const dataForKey = data[dataKey]; 
      const categories = Object.keys(dataForKey); 
      const values = Object.values(dataForKey); 

      setChartData([{
        name: titulo,
        data: values,
      }]);

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: { categories: categories,  title: {text: "Cantidad de Estudiantes"}}, 
        title: {
          text: titulo, 
          align: 'center',
        },
        yaxis: { title: { text: "Estrato" } },
        colors: ["#0345e4"],
      }));
    }
  }, [data]);

  return (
    <div>
      <ApexCharts
        options={chartOptions}
        series={chartData}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default BarChart;
