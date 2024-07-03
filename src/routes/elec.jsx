import React, { useEffect } from "react";
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import elecData from "../data/elecData.json"; // Import JSON data

const ElecChart = () => {
  useEffect(() => {
    const ctx = document.getElementById('elecChart');
    
    if (!ctx) return;

    // Parse JSON body
    const parsedData = JSON.parse(elecData.body);

    // Extract unique company codes
    const companies = [...new Set(parsedData.map(item => item.company_code))];

    // Extract unique years and sort them in ascending order
    const uniqueYears = [...new Set(parsedData.map(item => item.year))].sort((a, b) => a - b);

    // Prepare datasets for each company
    const datasets = companies.map(company => {
      const companyData = parsedData.filter(item => item.company_code === company);
      const dataValues = uniqueYears.map(year => {
        const dataPoint = companyData.find(item => item.year === year);
        return dataPoint ? dataPoint.electricity_consumption_mwh : null;
      });
      return {
        label: company,
        data: dataValues,
        fill: false,
        borderColor: getRandomColor(), // Example function to generate random colors
        tension: 0.1
      };
    });

    const data = {
      labels: uniqueYears,
      datasets: datasets
    };

    const chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Electricity Consumption by Year'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Year'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Electricity Consumption (MWh)'
            }
          }
        },
        onClick: (e) => {
          const canvasPosition = getRelativePosition(e, chart);

          // Example: Get data values corresponding to click position
          if (chart.scales && chart.scales.x && chart.scales.y) {
            const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
            const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
            console.log('Clicked on:', { x: dataX, y: dataY });
          }
        }
      }
    });

    return () => {
      chart.destroy();
    };
  }, []);

  // Function to generate random RGB color
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="chart-container">
      <canvas id="elecChart" width="600" height="400"></canvas>
    </div>
  );
};

export default ElecChart;
