import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { DoughnutChart } from "../DoughnutChart/DoughnutChart"; 
import "./PlanificadorActividadStyle.css";
import TableHeaderComponent from "../TableHeader/TableHeader";
import { showAlert } from "../functions";

interface MonthlyCompletion {
  task: string;
  color: string;
  completion: { [month: string]: number };
}

interface Task {
  period: number;
  month: string;
  task: string;
  color: string;
  completion: number;
}

const PlanificadorActividad: React.FC = () => {
  const baseURL = import.meta.env.VITE_API_URL;
  const [planificador, setPlanificador] = useState<MonthlyCompletion[]>([]);
  const [currentMonthCompletion, setCurrentMonthCompletion] = useState<number | null>(null); 
  const [tasksByColor, setTasksByColor] = useState<{ completion: number }[]>([]); 

  useEffect(() => {
      const getPlanificador = async () => {
          try {
              const response: AxiosResponse<any> = await axios.get(`${baseURL}/gantt/overview`);
              const tasksByMonth: MonthlyCompletion[] = [];

              for (const [monthKey, tasks] of Object.entries(response.data as { [month: string]: Task[] })) {
                  tasks.forEach((task: Task) => {
                      const existingTask = tasksByMonth.find((t) => t.task === task.task);

                      if (existingTask) {
                          if (task.completion !== undefined && task.completion !== null) {
                              existingTask.completion[monthKey] = task.completion;
                          }
                      } else {
                          if (task.completion !== undefined && task.completion !== null) {
                              tasksByMonth.push({
                                  task: task.task,
                                  color: task.color,
                                  completion: { [monthKey]: task.completion },
                              });
                          }
                      }
                  });
              }

              setPlanificador(tasksByMonth);

              const months = ["202408", "202409", "202410", "202411", "202412"];
              let totalCompletion = 0;
              let taskCount = 0;
              const allTasks: { completion: number }[] = []; 
              months.forEach((month) => {
                  tasksByMonth.forEach((actividad) => {
                      const completionValue = actividad.completion[month];
                      if (completionValue !== undefined) {
                          totalCompletion += completionValue;
                          taskCount++;
                          allTasks.push({ completion: completionValue }); 
                      }
                  });
              });

              const averageCompletion = taskCount > 0 ? totalCompletion / taskCount : null;
              setCurrentMonthCompletion(averageCompletion);
              setTasksByColor(allTasks); 
          } catch (error) {
              showAlert("Error al obtener los datos", "error");
          }
      };

      getPlanificador();
  }, [baseURL]);

  // Función para determinar el color basado en el porcentaje
  const getColor = (completionValue: number | undefined) => {
      if (completionValue === undefined) return "";
      if (completionValue === 0.00) return "blue"; // Programado
      if (completionValue === 100) return "green"; // Completado
      if (completionValue > 70) return "yellow"; // Cumplimiento parcial
      return "red"; // Cumplimiento incompleto
  };

  console.log("Cumplimiento promedio de Tareas:", currentMonthCompletion);

  return (
      <div className="table-container">
          <div className="tabla-contenedor-header">
              <TableHeaderComponent title="Planificador de Actividad" />
          </div>
          <div className="table-responsives">
              <table id="tableta" className="table table-bordered">
                  <thead className="text-center">
                      <tr>
                          <th className="col-tareas">Tareas</th>
                          {["Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((month) => (
                              <th key={month}>{month}</th>
                          ))}
                      </tr>
                  </thead>
                  <tbody className="table-group-divider">
                      {planificador.map((actividad, index) => (
                          <tr key={index} className="text-center">
                              <td style={{ backgroundColor: actividad.color, color: '#fff' }}>
                                  {actividad.task}
                              </td>
                              {["202408", "202409", "202410", "202411", "202412"].map(month => {
                                  const completionValue = actividad.completion[month];
                                  return (
                                      <td key={month} style={{ backgroundColor: getColor(completionValue), color: "#fff" }}>
                                          {completionValue !== undefined
                                              ? `${completionValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                                              : ''} 
                                      </td>
                                  );
                              })}
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* Mostrar el gráfico con los datos pasados */}
          {currentMonthCompletion !== null && (
              <div className="doughnut-chart-container">
                  <h3>Cumplimiento promedio de Tareas</h3>
                  <DoughnutChart tasks={tasksByColor} />
              </div>
          )}
      </div>
  );
};

export default PlanificadorActividad;
