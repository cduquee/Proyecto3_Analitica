import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import "../../index.css"; 

const BoxPlotChart = ({ data, dataKey, titulo, horiz, xtitulo, ytitulo, colortop, colorbottom}) => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: 'boxplot-chart',
      type: 'boxPlot',
    },
    title: {
      text: 'Diagrama de Caja',
      align: 'center',
    },
    xaxis: {
      categories: [],
      labels: {
        rotate: -20,
        style: {
          fontSize: '12px',
          fontWeight: 'normal'
        }
      },
      hideOverlappingLabels: true
    },
    plotOptions: {
      bar:{
        horizontal: horiz,
      },
      boxPlot: {
        colors: {
          upper: colortop,
          lower: colorbottom,
        },
      },
    },
  });

  useEffect(() => {
    if (data && data[dataKey]) {
      const dataForKey = data[dataKey]; 
      const categories = Object.keys(dataForKey);
      const values = Object.values(dataForKey); 

      const boxPlotData = categories.map((category, index) => ({
        x: category, 
        y: values[index], 
      }));

      setChartData(boxPlotData);

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: { categories: categories, title: {text: xtitulo}}, 
        title: {
          text: titulo,
          align: 'center',
        },
        yaxis: {
          title: {
            text: ytitulo,
          },
        }
      }));
    }
  }, [data, dataKey, titulo, horiz]);

  return (
    <div>
      <ApexCharts
        options={chartOptions}
        series={[{ name: titulo, data: chartData }]}  
        type="boxPlot"
        height={500}
      />
    </div>
  );
};

export default BoxPlotChart;
