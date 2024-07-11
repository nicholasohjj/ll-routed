import React, { useEffect, useState } from "react";
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import bopData from "../data/bopData.json"; // Import JSON data

const bopChart = () => {


    useEffect(() => {
        if (!bopData) return;

        console.log(bopData);
        const ctx = document.getElementById('bopChart');
        
        if (!ctx) return;

        // Parse JSON body
        const parsedData = JSON.parse(bopData.body);

        // Extract unique subcategories
        const subcategories = [...new Set(parsedData.map(item => item.subcategory_id))];

        // Extract unique years and sort them in ascending order
        const uniqueYears = [...new Set(parsedData.map(item => item.year))].sort((a, b) => a - b);

        // Prepare datasets for each subcategory
        const datasets = subcategories.map(subcategory => {
            const subcategoryData = parsedData.filter(item => item.subcategory_id === subcategory);
            const dataValues = uniqueYears.map(year => {
                const dataPoint = subcategoryData.find(item => item.year === year);
                return dataPoint ? dataPoint.value : null;
            });
            const subcategoryName = subcategoryData.length > 0 ? subcategoryData[0].name : `Subcategory ${subcategory}`;
            return {
                label: subcategoryName,
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
                        text: 'BoP Data by Year'
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
                            text: 'Values (Mill. USD)'
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
    }, [bopData]);

    // Function to generate random RGB color
    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const uniqueEntries = new Set();

// Filter unique subcategory_id and name
const filteredData = JSON.parse(bopData.body).filter(entry => {
    const key = `${entry.subcategory_id}-${entry.name}`;
    if (uniqueEntries.has(key)) {
      return false;
    } else {
      uniqueEntries.add(key);
      return true;
    }
  });

  const sortedData = filteredData.sort((a, b) => a.subcategory_id - b.subcategory_id);

  // Map the sorted data to a list of unique strings
  const uniqueStrings = sortedData.map(entry => `(${entry.subcategory_id},${entry.name})`);


    return (
        <div className="chart-container">
            <canvas id="bopChart" width="600" height="400"></canvas>

            {JSON.stringify(uniqueStrings)}

        </div>
    );
};

export default bopChart;
