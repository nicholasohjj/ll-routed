import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const Co2Chart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("co2.json");
        const data = await response.json();

        // Process the data to format it for the chart
        const companies = {};
        data.forEach((entry) => {
          const { company_code, year, co2_emission_ton } = entry;
          if (!companies[company_code]) {
            companies[company_code] = {};
          }
          companies[company_code][year] = co2_emission_ton;
        });

        const labels = Object.keys(companies);
        const datasets = Object.keys(companies).map((company) => ({
          label: company,
          data: Object.values(companies[company]).map((value) => value || 0),
        }));

        const chartData = {
          labels: Object.keys(companies[labels[0]]).map((year) => parseInt(year)),
          datasets: datasets,
        };

        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>CO2 Emissions</h1>
      {chartData && <Bar data={chartData} options={{}} />}
    </div>
  );
};

export default Co2Chart;
