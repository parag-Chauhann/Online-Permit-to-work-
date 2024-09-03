import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Card } from 'antd';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import "./DashboardPieChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardPieChart({ summary }) {
  const data = {
    labels: ['Initiated', 'In Process', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Permit Status',
        data: [summary.initiated, summary.inProcess, summary.approved, summary.rejected],
        backgroundColor: [
          'rgba(0, 150, 83, 0.5)', // Green for Initiated
          'rgba(0, 123, 255, 0.5)', // Blue for In Process
          'rgba(108, 217, 109, 0.5)', // Light Green for Approved
          'rgba(255, 0, 0, 0.5)' // Red for Rejected
        ],
        borderColor: [
          'rgba(0, 150, 83, 1)',
          'rgba(0, 123, 255, 1)',
          'rgba(108, 217, 109, 1)',
          'rgba(255, 0, 0, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          }
        }
      }
    },
    cutout: '60%', // Creates a "donut" effect
    elements: {
      arc: {
        borderWidth: 2
      }
    }
  };

  return (
    <Card style={{ width: 450, height: 450 }}>
      <Pie data={data} options={options} />
    </Card>
  );
}

export default DashboardPieChart;
