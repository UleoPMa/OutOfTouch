import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  // Estados para los intervalos de cada gráfico
  const [intervalC02, setIntervalC02] = useState('diario')
  const [intervalHumidity, setIntervalHumidity] = useState('diario')
  const [intervalTemperature, setIntervalTemperature] = useState('diario')
  const [intervalPressure, setIntervalPressure] = useState('diario')

  // Datos para cada gráfico
  const dataSetsC02 = {
    diario: {
      labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
      data: [12, 19, 3, 5, 2],
    },
    semanal: {
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      data: [22, 24, 19, 23, 25, 20, 21],
    },
    mensual: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      data: [100, 200, 150, 300],
    },
  }

  const dataSetsHumidity = {
    diario: {
      labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
      data: [30, 40, 35, 50, 45],
    },
    semanal: {
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      data: [60, 65, 70, 75, 80, 85, 90],
    },
    mensual: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      data: [70, 75, 80, 85],
    },
  }

  const dataSetsTemperature = {
    diario: {
      labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
      data: [15, 18, 20, 22, 19],
    },
    semanal: {
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      data: [20, 22, 21, 23, 24, 25, 26],
    },
    mensual: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      data: [22, 23, 24, 25],
    },
  }

  const dataSetsPressure = {
    diario: {
      labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
      data: [1010, 1012, 1015, 1013, 1011],
    },
    semanal: {
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      data: [1010, 1012, 1013, 1014, 1015, 1016, 1017],
    },
    mensual: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      data: [1012, 1013, 1014, 1015],
    },
  }

  // Configuración de los gráficos
  const createChartData = (dataSets, interval) => ({
    labels: dataSets[interval].labels,
    datasets: [
      {
        label: `Datos (${interval.charAt(0).toUpperCase() + interval.slice(1)})`,
        data: dataSets[interval].data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  })

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfico de Datos',
      },
    },
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menú lateral */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-center text-2xl font-bold border-b border-gray-700">
          Dashboard
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li>
              <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">
                Inicio
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">
                Gráficos
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">
                Configuración de alertas
              </a>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">
            Cerrar sesión
          </a>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-3">
        {/* Gráficos en cuadrícula */}
        <div className="grid grid-cols-2 gap-5 h-full">
          {/* Gráfico de CO2 */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Gráfico de CO2</h2>
            <select
              value={intervalC02}
              onChange={(e) => setIntervalC02(e.target.value)}
              className="mb-4 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
            </select>
            <Line data={createChartData(dataSetsC02, intervalC02)} options={chartOptions} />
          </div>

          {/* Gráfico de Humedad */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Gráfico de Humedad</h2>
            <select
              value={intervalHumidity}
              onChange={(e) => setIntervalHumidity(e.target.value)}
              className="mb-4 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
            </select>
            <Line data={createChartData(dataSetsHumidity, intervalHumidity)} options={chartOptions} />
          </div>

          {/* Gráfico de Temperatura */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Gráfico de Temperatura</h2>
            <select
              value={intervalTemperature}
              onChange={(e) => setIntervalTemperature(e.target.value)}
              className="mb-4 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
            </select>
            <Line data={createChartData(dataSetsTemperature, intervalTemperature)} options={chartOptions} />
          </div>

          {/* Gráfico de Presión */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Gráfico de Presión</h2>
            <select
              value={intervalPressure}
              onChange={(e) => setIntervalPressure(e.target.value)}
              className="mb-4 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
            </select>
            <Line data={createChartData(dataSetsPressure, intervalPressure)} options={chartOptions} />
          </div>
        </div>
      </main>
    </div>
  )
}