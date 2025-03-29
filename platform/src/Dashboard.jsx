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
import Chatbot from './components/Chatbot'

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

  const [isModalOpen, setIsModalOpen] = useState(true) // Estado para la ventana flotante
  const [subOption, setSubOption] = useState('') // Estado para la subopción seleccionada
  const [activeSection, setActiveSection] = useState('') // Estado para la sección activa

  const [alertConfig, setAlertConfig] = useState({
    particle: '',
    condition: '',
    threshold: '',
    timeInterval: '',
    mediums: {
      whatsapp: false,
      email: false,
      sms: false,
    },
  })

  const handleFileSelection = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = () => {
      setIsModalOpen(false) // Cerrar la ventana flotante al seleccionar un archivo
    }
    input.click()
  }

  const handleCloudOption = (option) => {
    setSubOption(option)
    setIsModalOpen(false) // Cerrar la ventana flotante al seleccionar una opción de nube
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setAlertConfig((prev) => ({
      ...prev,
      [name]: { ...prev[name], enabled: checked },
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAlertConfig((prev) => ({
      ...prev,
      [name]: { ...prev[name], value },
    }))
  }

  const handleAlertChange = (e) => {
    const { name, value } = e.target
    setAlertConfig((prev) => ({ ...prev, [name]: value }))
  }

  const handleMediumChange = (e) => {
    const { name, checked } = e.target
    setAlertConfig((prev) => ({
      ...prev,
      mediums: { ...prev.mediums, [name]: checked },
    }))
  }

  const handleAlertSubmit = (e) => {
    e.preventDefault()
    console.log('Alert configuration saved:', alertConfig)
    alert('Configuración de alertas guardada exitosamente.')
  }

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
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Ventana flotante */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center">Selecciona una opción</h2>
            <div className="space-y-4">
              <button
                onClick={handleFileSelection}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Elegir un archivo
              </button>
              <div>
                <h3 className="text-lg font-semibold mb-2">Conectar a la nube</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCloudOption('aws')}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Conectar a AWS IoT
                  </button>
                  <button
                    onClick={() => handleCloudOption('google')}
                    className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                  >
                    Conectar a Google Cloud
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menú lateral */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-center text-2xl font-bold border-b border-gray-700">
          Dashboard
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => setActiveSection('inicio')}
                className="block w-full text-left px-4 py-2 rounded hover:bg-gray-700"
              >
                Inicio
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('graficos')}
                className="block w-full text-left px-4 py-2 rounded hover:bg-gray-700"
              >
                Gráficos
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('configuracion')}
                className="block w-full text-left px-4 py-2 rounded hover:bg-gray-700"
              >
                Configuración de alertas
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <a href="/" className="block px-4 py-2 rounded hover:bg-gray-700">
            Cerrar sesión
          </a>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-3">
        {activeSection === '' && (
          <div className="text-center text-gray-500">
            <h2 className="text-2xl">Selecciona una sección del menú lateral</h2>
          </div>
        )}
        {activeSection === 'inicio' && (
          <div>
            <h2 className="text-2xl font-bold">Inicio</h2>
            <p>Contenido de la sección Inicio.</p>
          </div>
        )}
        {activeSection === 'graficos' && (
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
        )}
        {activeSection === 'configuracion' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Configuración de alertas</h2>
            <form onSubmit={handleAlertSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="particle">
                  Seleccionar partícula:
                </label>
                <select
                  id="particle"
                  name="particle"
                  value={alertConfig.particle}
                  onChange={handleAlertChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Seleccione una opción</option>
                  <option value="co2">CO2</option>
                  <option value="humidity">Humedad</option>
                  <option value="temperature">Temperatura</option>
                  <option value="pressure">Presión</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="condition">
                  Condición:
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={alertConfig.condition}
                  onChange={handleAlertChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Seleccione una opción</option>
                  <option value="greater">Mayor a</option>
                  <option value="less">Menor a</option>
                  <option value="less">Igual a</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="threshold">
                  Umbral de medición:
                </label>
                <input
                  type="number"
                  id="threshold"
                  name="threshold"
                  value={alertConfig.threshold}
                  onChange={handleAlertChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese el valor del umbral"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="timeInterval">
                  Intervalo de tiempo (en minutos):
                </label>
                <input
                  type="number"
                  id="timeInterval"
                  name="timeInterval"
                  value={alertConfig.timeInterval}
                  onChange={handleAlertChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ingrese el intervalo de tiempo"
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Medios para recibir alertas:</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="whatsapp"
                    checked={alertConfig.mediums.whatsapp}
                    onChange={handleMediumChange}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>WhatsApp</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="email"
                    checked={alertConfig.mediums.email}
                    onChange={handleMediumChange}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Correo</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="sms"
                    checked={alertConfig.mediums.sms}
                    onChange={handleMediumChange}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>SMS</span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Guardar configuración
              </button>
            </form>
          </div>
        )}
      </main>

      <Chatbot />
    </div>
  )
}