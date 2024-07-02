import React, { useEffect, useState } from "react";
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import co2data from "../data/co2Data.json"; // Import JSON data
import { getCO2Emissions } from "../services/dataService";


const Co2Chart = () => {
    const [co2Data, setCo2Data] = useState(null);
    useEffect(() => {
        getCO2Emissions("Vrld5Hngy49kGStJdcV8s9cCIqWB34AL2wBDetVe").then((data) => {
            setCo2Data(data);
        });
    }, []);

  useEffect(() => {
    console.log(co2Data);
    const ctx = document.getElementById('co2Chart');
    
    if (!ctx) return;

    // Parse JSON body
    const parsedData = JSON.parse(co2data.body);

    // Extract unique company codes
    const companies = [...new Set(parsedData.map(item => item.company_code))];

    // Extract unique years
    const uniqueYears = [...new Set(parsedData.map(item => item.year))];

    // Prepare datasets for each company
    const datasets = companies.map(company => {
      const companyData = parsedData.filter(item => item.company_code === company);
      const dataValues = uniqueYears.map(year => {
        const dataPoint = companyData.find(item => item.year === year);
        return dataPoint ? dataPoint.co2_emission_ton : null;
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
            text: 'CO2 Emissions by Year'
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
              text: 'CO2 Emissions (tons)'
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
      <canvas id="co2Chart" width="600" height="400"></canvas>
    </div>
  );
};

export default Co2Chart;
