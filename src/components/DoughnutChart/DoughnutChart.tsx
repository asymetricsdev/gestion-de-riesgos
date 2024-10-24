import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  tasks: { completion: number }[]; 
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ tasks }) => {
    let azul = 0;
    let verde = 0;
    let amarillo = 0;
    let rojo = 0;

    if (Array.isArray(tasks)) {
      tasks.forEach((task) => {
        const completion = task.completion;
        if (completion === 0) {
          azul++;
        } else if (completion === 100) {
          verde++;
        } else if (completion > 70) {
          amarillo++;
        } else {
          rojo++;
        }
      });
    } else {
      console.error("tasks no es un array o está indefinido");
    }

    const totalTasks = tasks.length;

    const data = {
      labels: ["Programado (0%)", "Cumplido (100%)", "Cumplimiento parcial (>70%)", "Incompleto (<=70%)"],
      datasets: [
        {
          label: "Distribución de Cumplimiento",
          data: [azul, verde, amarillo, rojo],
          backgroundColor: ["blue", "green", "yellow", "red"],
          borderColor: ["#fff", "#fff", "#fff", "#fff"],
          borderWidth: 1,
        },
      ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom" as const, 
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}%`;
                    },
                },
            },
        },
    };

    return <Doughnut data={data} options={options} />;
};
