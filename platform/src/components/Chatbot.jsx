import React, { useState, useEffect, useRef } from 'react';
import '../css/Chatbot.css';

const Chatbot = () => {
  // Estado del componente
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Estoy para ayudarte con el análisis de calidad del aire", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [demoData, setDemoData] = useState(null);

  // Referencias
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Configuración de la API
  const API_URL = 'http://localhost:3000/message';

  // Constantes para el análisis de parámetros
  const VALID_PARAMETERS = ['PM2.5', 'CO2', 'Temp.', 'Humidity'];
  const PARAMETER_THRESHOLDS = {
    'PM2.5': { low: 12, medium: 35 },
    'CO2': { low: 800, medium: 1200 },
    'Temp.': { min: 18, max: 24 },
    'Humidity': { min: 30, max: 60 }
  };

  // Cargar datos de demo.txt al inicio
  useEffect(() => {
    const loadDemoData = async () => {
      try {
        console.log('Intentando cargar demo.txt...');
        const response = await fetch('/demo.txt');

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const text = await response.text();
        console.log('Contenido raw de demo.txt:', text.substring(0, 100) + '...');

        if (!text || text.trim() === '') {
          throw new Error('El archivo demo.txt está vacío');
        }

        // Parsear los datos tabulados en un formato utilizable
        const lines = text.split('\n');
        console.log(`Número de líneas detectadas: ${lines.length}`);

        if (lines.length < 2) {
          throw new Error('El archivo no contiene suficientes líneas de datos');
        }

        const headers = lines[0].split('\t').map(header => header.trim());
        console.log('Headers detectados:', headers);

        const data = lines.slice(1)
          .filter(line => line.trim() !== '')
          .map(line => {
            const values = line.split('\t');
            const entry = {};

            headers.forEach((header, index) => {
              entry[header.trim()] = values[index] ? values[index].trim() : '';
            });

            return entry;
          });

        console.log('Demo data cargada:', data.length, 'entradas');
        console.log('Primera entrada:', data[0]);

        setDemoData(data);
      } catch (error) {
        console.error('Error detallado al cargar demo data:', error);
        // Intenta una ruta alternativa como fallback
        try {
          console.log('Intentando ruta alternativa...');
          const response = await fetch('./demo.txt');
          if (!response.ok) throw new Error('Segunda ruta también falló');

          const text = await response.text();
          // Continuar el proceso como antes...
          // ... (código de procesamiento similar)
        } catch (secondError) {
          console.error('Error en la ruta alternativa:', secondError);
        }
      }
    };

    loadDemoData();
  }, []);

  // Desplazar hacia abajo cuando se añaden nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Funciones de UI
  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Enfoque en el input cuando se abre el chat
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Por favor, selecciona una imagen menor a 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile({
          file,
          base64: reader.result.split(',')[1]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { text: "¡Hola! Estoy para ayudarte con el análisis de calidad del aire", sender: 'bot', timestamp: new Date() }
    ]);
    setImageFile(null);
  };

  const getParameterAssessment = (parameter, value) => {
    const numValue = parseFloat(value);

    switch (parameter) {
      case 'PM2.5':
        if (numValue <= PARAMETER_THRESHOLDS['PM2.5'].low)
          return {
            assessment: 'Excelente calidad del aire (según OMS).',
            status: 'excellent',
            recommendation: 'No se requieren acciones adicionales.'
          };
        if (numValue <= PARAMETER_THRESHOLDS['PM2.5'].medium)
          return {
            assessment: 'Calidad del aire aceptable.',
            status: 'acceptable',
            recommendation: 'Considere mantener ventilación regular.'
          };
        return {
          assessment: 'Calidad del aire pobre.',
          status: 'poor',
          recommendation: 'Se recomienda usar purificador de aire y mejorar la ventilación.'
        };

      case 'CO2':
        if (numValue <= PARAMETER_THRESHOLDS.CO2.low)
          return {
            assessment: 'Nivel óptimo para interiores.',
            status: 'excellent',
            recommendation: 'Mantener la ventilación actual.'
          };
        if (numValue <= PARAMETER_THRESHOLDS.CO2.medium)
          return {
            assessment: 'Nivel aceptable.',
            status: 'acceptable',
            recommendation: 'Considere aumentar ligeramente la ventilación.'
          };
        return {
          assessment: 'Nivel alto - se requiere mejor ventilación.',
          status: 'poor',
          recommendation: 'Abra ventanas o mejore el sistema de ventilación inmediatamente.'
        };

      case 'Temp.':
        if (numValue >= PARAMETER_THRESHOLDS.Temp.min && numValue <= PARAMETER_THRESHOLDS.Temp.max)
          return {
            assessment: 'Temperatura en rango confortable.',
            status: 'excellent',
            recommendation: 'Mantener control actual de temperatura.'
          };
        if (numValue < PARAMETER_THRESHOLDS.Temp.min)
          return {
            assessment: `Temperatura por debajo del rango recomendado (${PARAMETER_THRESHOLDS.Temp.min}°C).`,
            status: 'poor',
            recommendation: 'Considere aumentar la calefacción o revisar aislamiento.'
          };
        return {
          assessment: `Temperatura por encima del rango recomendado (${PARAMETER_THRESHOLDS.Temp.max}°C).`,
          status: 'poor',
          recommendation: 'Considere enfriar el ambiente o mejorar la circulación de aire.'
        };

      case 'Humidity':
        if (numValue >= PARAMETER_THRESHOLDS.Humidity.min && numValue <= PARAMETER_THRESHOLDS.Humidity.max)
          return {
            assessment: 'Humedad en rango saludable.',
            status: 'excellent',
            recommendation: 'Mantener los niveles actuales.'
          };
        if (numValue < PARAMETER_THRESHOLDS.Humidity.min)
          return {
            assessment: `Humedad por debajo del mínimo recomendado (${PARAMETER_THRESHOLDS.Humidity.min}%).`,
            status: 'poor',
            recommendation: 'Considere usar humidificador para prevenir sequedad.'
          };
        return {
          assessment: `Humedad por encima del máximo recomendado (${PARAMETER_THRESHOLDS.Humidity.max}%).`,
          status: 'poor',
          recommendation: 'Considere usar deshumidificador para prevenir moho y condensación.'
        };

      default:
        return {
          assessment: 'Parámetro no reconocido.',
          status: 'unknown',
          recommendation: ''
        };
    }
  };

  const analyzeCorrelations = (data) => {
    try {
      // Extraer valores numéricos
      const pm25Values = data.map(entry => parseFloat(entry['PM2.5'] || 0));
      const co2Values = data.map(entry => parseFloat(entry['CO2'] || 0));
      const tempValues = data.map(entry => parseFloat(entry['Temp.'] || 0));
      const humidityValues = data.map(entry => parseFloat(entry['Humidity'] || 0));

      // Calcular correlaciones entre todos los parámetros
      const correlations = [
        {
          pair: 'PM2.5 vs Humidity',
          value: calculateCorrelation(pm25Values, humidityValues),
          description: ''
        },
        {
          pair: 'PM2.5 vs Temperature',
          value: calculateCorrelation(pm25Values, tempValues),
          description: ''
        },
        {
          pair: 'CO2 vs Temperature',
          value: calculateCorrelation(co2Values, tempValues),
          description: ''
        },
        {
          pair: 'CO2 vs Humidity',
          value: calculateCorrelation(co2Values, humidityValues),
          description: ''
        },
        {
          pair: 'Temperature vs Humidity',
          value: calculateCorrelation(tempValues, humidityValues),
          description: ''
        }
      ];

      // Añadir descripciones basadas en la fuerza de la correlación
      correlations.forEach(corr => {
        const [param1, param2] = corr.pair.split(' vs ');

        if (Math.abs(corr.value) < 0.2) {
          corr.description = `No hay relación significativa entre ${param1} y ${param2}.`;
          corr.strength = 'none';
        } else if (Math.abs(corr.value) < 0.4) {
          corr.description = `Hay una relación débil entre ${param1} y ${param2}. ${param1} tiende a ${corr.value > 0 ? 'aumentar' : 'disminuir'} ligeramente cuando ${param2} ${corr.value > 0 ? 'aumenta' : 'disminuye'}.`;
          corr.strength = 'weak';
        } else if (Math.abs(corr.value) < 0.7) {
          corr.description = `Existe una relación moderada entre ${param1} y ${param2}. ${param1} suele ${corr.value > 0 ? 'aumentar' : 'disminuir'} cuando ${param2} ${corr.value > 0 ? 'aumenta' : 'disminuye'}.`;
          corr.strength = 'moderate';
        } else {
          corr.description = `Hay una fuerte relación entre ${param1} y ${param2}. ${param1} ${corr.value > 0 ? 'aumenta' : 'disminuye'} consistentemente cuando ${param2} ${corr.value > 0 ? 'aumenta' : 'disminuye'}.`;
          corr.strength = 'strong';
        }
      });

      // Ordenar por fuerza de correlación (absoluta)
      correlations.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

      // Identificar las correlaciones más significativas
      const significantCorrelations = correlations.filter(c => Math.abs(c.value) > 0.3);

      return {
        all: correlations,
        significant: significantCorrelations,
        summary: significantCorrelations.length > 0
          ? significantCorrelations.map(c => c.description).join(' ')
          : "No se han detectado correlaciones significativas entre los parámetros."
      };
    } catch (error) {
      console.error('Error analyzing correlations:', error);
      return {
        all: [],
        significant: [],
        summary: "No se pudieron analizar correlaciones debido a un error en los datos."
      };
    }
  };

  const calculateCorrelation = (xArray, yArray) => {
    // Implementación simple del coeficiente de correlación de Pearson
    try {
      const n = xArray.length;
      let sum_x = 0;
      let sum_y = 0;
      let sum_xy = 0;
      let sum_x2 = 0;
      let sum_y2 = 0;

      for (let i = 0; i < n; i++) {
        sum_x += xArray[i];
        sum_y += yArray[i];
        sum_xy += xArray[i] * yArray[i];
        sum_x2 += xArray[i] * xArray[i];
        sum_y2 += yArray[i] * yArray[i];
      }

      const numerator = n * sum_xy - sum_x * sum_y;
      const denominator = Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y));

      if (denominator === 0) return 0;

      return numerator / denominator;
    } catch (error) {
      console.error('Error calculating correlation:', error);
      return 0;
    }
  };

  const analyzeParameterRange = (parameter, range, data) => {
    if (!VALID_PARAMETERS.includes(parameter)) {
      return `Parámetro no válido. Opciones: ${VALID_PARAMETERS.join(', ')}`;
    }

    const values = data.map(entry => parseFloat(entry[parameter] || 0));

    if (range && range.includes('-')) {
      const [min, max] = range.split('-').map(Number);
      const inRange = values.filter(val => val >= min && val <= max).length;
      const percentage = ((inRange / values.length) * 100).toFixed(1);

      return `El ${parameter} estuvo entre ${min} y ${max} en ${inRange} de ${values.length} mediciones (${percentage}% del tiempo).`;
    }

    return `Datos de ${parameter}: 
    - Promedio: ${(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)}
    - Mínimo: ${Math.min(...values)}
    - Máximo: ${Math.max(...values)}`;
  };

  const analyzeSpecificValue = (parameter, data) => {
    if (!data || data.length === 0) {
      return `No hay datos disponibles para ${parameter}.`;
    }

    const lastEntry = data[data.length - 1];
    const currentValue = lastEntry[parameter];

    if (!currentValue) {
      return `No se encontró un valor para ${parameter} en los datos.`;
    }

    return `El último valor registrado de ${parameter} fue ${currentValue}. ${getParameterAssessment(parameter, currentValue)}`;
  };

  const analyzeDemoData = (requestType = 'general', parameter = null, range = null) => {
    if (!demoData || demoData.length === 0) {
      return {
        text: "No se han podido cargar los datos de demostración.",
        details: {}
      };
    }

    try {
      // Calcular estadísticas básicas
      const pm25Values = demoData.map(entry => parseFloat(entry['PM2.5'] || 0));
      const co2Values = demoData.map(entry => parseFloat(entry['CO2'] || 0));
      const tempValues = demoData.map(entry => parseFloat(entry['Temp.'] || 0));
      const humidityValues = demoData.map(entry => parseFloat(entry['Humidity'] || 0));

      const calcStats = (values) => {
        values = values.filter(v => !isNaN(v));
        if (values.length === 0) return { avg: 0, min: 0, max: 0, median: 0 };

        values.sort((a, b) => a - b);
        const mid = Math.floor(values.length / 2);
        const median = values.length % 2 === 0
          ? (values[mid - 1] + values[mid]) / 2
          : values[mid];

        return {
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: values[0],
          max: values[values.length - 1],
          median,
          count: values.length
        };
      };

      const stats = {
        'PM2.5': calcStats(pm25Values),
        'CO2': calcStats(co2Values),
        'Temp.': calcStats(tempValues),
        'Humidity': calcStats(humidityValues)
      };

      // Fechas de mediciones
      const firstDate = demoData[0]?.['Date'] || 'fecha desconocida';
      const lastDate = demoData[demoData.length - 1]?.['Date'] || 'fecha desconocida';

      // Analizar correlaciones
      const correlationAnalysis = analyzeCorrelations(demoData);

      // Analizar tendencias
      const trendAnalysis = analyzeTrends(demoData);

      // Análisis específico según solicitud
      if (requestType === 'range' && parameter) {
        const rangeResult = analyzeParameterRange(parameter, range, demoData);
        return {
          text: rangeResult,
          details: {
            type: 'range_analysis',
            parameter,
            range
          }
        };
      } else if (requestType === 'value' && parameter) {
        // Obtener datos del último valor y su evaluación
        const lastEntry = demoData[demoData.length - 1];
        const currentValue = parseFloat(lastEntry[parameter] || 0);
        const assessment = getParameterAssessment(parameter, currentValue);

        // Comparar con promedio histórico
        const avg = stats[parameter].avg;
        const diff = currentValue - avg;
        const percentDiff = (diff / avg * 100).toFixed(1);

        const comparisonText = Math.abs(diff) < 0.001 ?
          "igual al promedio histórico" :
          `${diff > 0 ? "por encima" : "por debajo"} del promedio histórico (${Math.abs(percentDiff)}%)`;

        const analysisText = `El último valor registrado de ${parameter} fue ${currentValue}. 
        Este valor está ${comparisonText}.
        Evaluación: ${assessment.assessment} 
        Recomendación: ${assessment.recommendation}`;

        return {
          text: analysisText,
          details: {
            type: 'parameter_analysis',
            parameter,
            currentValue,
            assessment,
            comparison: { avg, diff, percentDiff }
          }
        };
      }

      // Análisis general (resumen completo)
      const generalSummary = `Análisis de datos del ${firstDate} al ${lastDate}: 
      - PM2.5: promedio ${stats['PM2.5'].avg.toFixed(1)} µg/m³ (min: ${stats['PM2.5'].min.toFixed(1)}, max: ${stats['PM2.5'].max.toFixed(1)})
      - CO2: promedio ${stats['CO2'].avg.toFixed(0)} ppm (min: ${stats['CO2'].min.toFixed(0)}, max: ${stats['CO2'].max.toFixed(0)})
      - Temperatura: promedio ${stats['Temp.'].avg.toFixed(1)}°C (min: ${stats['Temp.'].min.toFixed(1)}, max: ${stats['Temp.'].max.toFixed(1)})
      - Humedad: promedio ${stats['Humidity'].avg.toFixed(1)}%
      
      ${correlationAnalysis.summary}
      
      ${trendAnalysis.summary}`;

      // Últimos valores y evaluaciones
      const lastEntry = demoData[demoData.length - 1];
      const lastValues = {};

      for (const param of VALID_PARAMETERS) {
        const value = parseFloat(lastEntry[param] || 0);
        lastValues[param] = {
          value,
          assessment: getParameterAssessment(param, value)
        };
      }

      // Crear objeto con todos los resultados
      return {
        text: generalSummary,
        details: {
          type: 'complete_analysis',
          dateRange: { first: firstDate, last: lastDate },
          statistics: stats,
          correlations: correlationAnalysis,
          trends: trendAnalysis,
          currentValues: lastValues
        }
      };
    } catch (error) {
      console.error('Error analyzing demo data:', error);
      return {
        text: "Ha ocurrido un error al analizar los datos. Por favor, inténtalo de nuevo.",
        details: { error: error.message }
      };
    }
  };
  const analyzeTrends = (data) => {
    if (!data || data.length < 2) return { summary: "Datos insuficientes para analizar tendencias." };

    try {
      // Extraer series temporales
      const pm25Series = data.map(entry => parseFloat(entry['PM2.5'] || 0));
      const co2Series = data.map(entry => parseFloat(entry['CO2'] || 0));
      const tempSeries = data.map(entry => parseFloat(entry['Temp.'] || 0));
      const humiditySeries = data.map(entry => parseFloat(entry['Humidity'] || 0));

      // Calcular tendencias lineales (pendiente)
      const calculateTrendSlope = (series) => {
        const n = series.length;
        const indices = Array.from({ length: n }, (_, i) => i);

        const sumX = indices.reduce((sum, x) => sum + x, 0);
        const sumY = series.reduce((sum, y) => sum + y, 0);
        const sumXY = indices.reduce((sum, x, i) => sum + x * series[i], 0);
        const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);

        // Pendiente de la línea de tendencia
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

        // Porcentaje de cambio relativo a la media
        const mean = sumY / n;
        const relativeChange = (slope * (n - 1) / mean) * 100;

        return {
          slope,
          relativeChange,
          increasing: slope > 0,
          significant: Math.abs(relativeChange) > 5 // Consideramos >5% como significativo
        };
      };

      // Analizar tendencias para cada parámetro
      const trends = {
        'PM2.5': calculateTrendSlope(pm25Series),
        'CO2': calculateTrendSlope(co2Series),
        'Temp.': calculateTrendSlope(tempSeries),
        'Humidity': calculateTrendSlope(humiditySeries)
      };

      // Generar descripciones para tendencias significativas
      const trendDescriptions = [];

      Object.entries(trends).forEach(([parameter, trend]) => {
        if (trend.significant) {
          const direction = trend.increasing ? 'aumentando' : 'disminuyendo';
          const magnitude = Math.abs(trend.relativeChange);
          let intensidad = 'ligeramente';

          if (magnitude > 15) intensidad = 'considerablemente';
          if (magnitude > 25) intensidad = 'drásticamente';

          trendDescriptions.push(`${parameter} está ${direction} ${intensidad} (${magnitude.toFixed(1)}% de cambio).`);
        }
      });

      // Detectar patrones cíclicos (simplificado)
      const detectCycle = (series) => {
        if (series.length < 6) return false;

        // Verificar si hay oscilaciones alternadas (simplificado)
        let changes = 0;
        for (let i = 2; i < series.length; i++) {
          if ((series[i] > series[i - 1] && series[i - 1] < series[i - 2]) ||
            (series[i] < series[i - 1] && series[i - 1] > series[i - 2])) {
            changes++;
          }
        }

        // Si hay muchos cambios de dirección, puede ser cíclico
        return changes > series.length / 3;
      };

      const cycles = {
        'PM2.5': detectCycle(pm25Series),
        'CO2': detectCycle(co2Series),
        'Temp.': detectCycle(tempSeries),
        'Humidity': detectCycle(humiditySeries)
      };

      // Añadir descripciones de ciclos
      Object.entries(cycles).forEach(([parameter, hasCycle]) => {
        if (hasCycle) {
          trendDescriptions.push(`${parameter} muestra un patrón cíclico o fluctuante.`);
        }
      });

      return {
        trends,
        cycles,
        descriptions: trendDescriptions,
        summary: trendDescriptions.length > 0
          ? trendDescriptions.join(' ')
          : "No se detectaron tendencias significativas en los datos."
      };
    } catch (error) {
      console.error('Error analyzing trends:', error);
      return { summary: "No se pudieron analizar tendencias debido a un error en los datos." };
    }
  };
  // Reconocimiento de voz
  const startVoiceInput = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Lo sentimos, tu navegador no soporta reconocimiento de voz.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);

      // Auto-enviar después de 500ms para dar tiempo a ver lo reconocido
      setTimeout(() => {
        sendMessage(transcript);
      }, 500);
    };

    recognition.onerror = (event) => {
      console.error('Error en reconocimiento de voz:', event.error);
      if (event.error === 'no-speech') {
        alert('No se detectó ninguna voz. Por favor, inténtalo de nuevo.');
      }
    };

    recognition.start();
  };

  // Enviar mensaje
  const sendMessage = async (voiceText = null) => {
    const textToSend = voiceText || inputText;

    if (textToSend.trim() === '' && !imageFile) return;

    const userMessage = {
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
      image: imageFile?.file
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Analizar el texto para determinar si es una solicitud de datos específica
      const lowerText = textToSend.toLowerCase();

      // Detectar si pide datos de un parámetro específico
      let parameterRequested = null;
      let rangeRequested = null;
      let requestType = 'general';

      // Verificar si menciona un parámetro específico
      for (const param of VALID_PARAMETERS) {
        if (lowerText.includes(param.toLowerCase())) {
          parameterRequested = param;
          requestType = 'value';
          break;
        }
      }

      // Buscar un rango numérico (ej: "entre 20 y 30")
      const rangeRegex = /entre\s+(\d+)\s+y\s+(\d+)|(\d+)\s*-\s*(\d+)/i;
      const rangeMatch = lowerText.match(rangeRegex);

      if (rangeMatch) {
        const min = rangeMatch[1] || rangeMatch[3];
        const max = rangeMatch[2] || rangeMatch[4];
        rangeRequested = `${min}-${max}`;
        requestType = 'range';
      }

      // Verificar si es una solicitud de datos de demo
      const isDemoRequest =
        lowerText.includes('demo') ||
        lowerText.includes('datos') ||
        lowerText.includes('calidad del aire') ||
        lowerText.includes('aire') ||
        lowerText.includes('estadísticas') ||
        (parameterRequested !== null);

        let response, data;
        const headers = {
          "Content-Type": "application/json"
        };

        if (isDemoRequest && demoData) {
        const analysisResult = analyzeDemoData(requestType, parameterRequested, rangeRequested);

        const prompt = `Eres un analista ambiental especializado que explica datos a usuarios no técnicos.
        Por favor, reformula este análisis ya procesado para responder a la consulta del usuario. 
        No menciones que ya tienes un análisis o que eres un asistente. Simplemente explica los datos
        de forma natural y conversacional como si fueras un experto ambiental. Sé breve y conciso.
        
        ANÁLISIS TÉCNICO: ${analysisResult.text}
        
        CONSULTA DEL USUARIO: ${textToSend}
        
        DATOS ADICIONALES Y CONTEXTO: ${JSON.stringify(analysisResult.details)}
        
        Responde directamente a la consulta usando la información proporcionada, en 1-2 párrafos máximo.`;

        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              data: prompt + " " + textToSend
            }),
            timeout: 30000
          });

          const botResponse = await response.json();

          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: botResponse,
              sender: 'bot',
              timestamp: new Date()
            }]);
            setIsLoading(false);
            setImageFile(null);
          }, 800);
        } catch (error) {
          console.error('Error communicating with Gemini API:', error);

          // Si falla la API, podemos mostrar directamente nuestro análisis
          setTimeout(() => {
            setMessages(prev => [...prev, {
              text: analysisResult.text,
              sender: 'bot',
              timestamp: new Date()
            }]);
            setIsLoading(false);
            setImageFile(null);
          }, 800);
        }

        return;
      } else {
        const prompt = `Eres un analista ambiental experto. Tu objetivo es analizar datos de calidad del aire y proporcionar insights útiles.

      IMPORTANTE:
      - Nunca digas "Entendido" o "Estoy listo para analizar"
      - Nunca te presentes o describas tu rol
      - Responde directamente a lo que se pregunta sin introducciones
      - Limita tus respuestas a 2-3 frases cortas y concisas
      - Usa lenguaje natural y conversacional

      Para datos de PM2.5, CO2, temperatura y humedad:
      - Identifica patrones importantes
      - Relaciona parámetros entre sí cuando sea relevante
      - Ofrece recomendaciones prácticas solo cuando sea apropiado
      - Evita repetir información que ya has proporcionado

      EVITA COMPLETAMENTE:
      - Frases como "Entendido", "Claro", "Estoy aquí para ayudar"
      - Mencionar que eres un analista o asistente
      - Listas con viñetas
      - Respuestas largas
      `;

        if (imageFile) {
          data = {
            contents: [{
              parts: [
                { text: prompt + " " + (textToSend || "Analiza esta imagen") },
                {
                  inline_data: {
                    mime_type: imageFile.file.type,
                    data: imageFile.base64
                  }
                }
              ]
            }]
          };
        } else {
          data = prompt + " " + textToSend;
        }

        response = await fetch(API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            data
          }),
          timeout: 30000
        });

        const botResponse = await response.json()

        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: botResponse,
            sender: 'bot',
            timestamp: new Date()
          }]);
          setIsLoading(false);
          setImageFile(null);
        }, 500);
      }
    }
    catch (error) {
      console.error('Error communicating with Gemini API:', error);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.",
          sender: 'bot',
          timestamp: new Date(),
          isError: true
        }]);
        setIsLoading(false);
      }, 500);
    }
  };

  // Formatear la hora para mostrar en los mensajes
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Componente para el indicador de carga
  const LoadingIndicator = () => (
    <div className="loading-dots">
      <div className="dot" style={{ animationDelay: '0s' }}></div>
      <div className="dot" style={{ animationDelay: '0.2s' }}></div>
      <div className="dot" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );

  return (
    <>
      <div
        className="chat-button"
        onClick={toggleChat}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        <svg className="chat-icon" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
        </svg>
      </div>

      <div
        className={`chat-window environmental-chat ${!isOpen ? 'hidden' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="chat-header">
          <h3>Asesor Ambiental</h3>
          <div className="header-actions">
            <button
              onClick={clearChat}
              className="clear-button"
              aria-label="Borrar conversación"
              title="Borrar conversación"
            >
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
            <button
              onClick={toggleChat}
              className="close-button"
              aria-label="Cerrar chat"
            >
              <svg
                className="close-icon"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.isError ? 'error-message' : ''}`}
            >
              {message.image && (
                <div className="message-image">
                  <img
                    src={URL.createObjectURL(message.image)}
                    alt="Imagen subida"
                    className="uploaded-image"
                  />
                </div>
              )}
              <div className="message-content">{message.text}</div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          ))}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <button
            className="microphone-button"
            onClick={startVoiceInput}
            aria-label="Iniciar entrada de voz"
            title="Hablar"
          >
            <svg viewBox="0 0 24 24" className="mic-icon">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.21-1.79 4-4 4s-4-1.79-4-4H5c0 3.21 2.3 5.88 5.31 6.41V21h2.14v-3.59C16.7 17.48 19 14.81 19 11h-2z" />
            </svg>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            className="image-upload-button"
            onClick={() => fileInputRef.current.click()}
            aria-label="Subir imagen"
            title="Subir imagen"
          >
            <svg viewBox="0 0 24 24" className="image-icon">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </button>

          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="message-input"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            ref={inputRef}
            aria-label="Mensaje"
          />
          <button
            className="send-button"
            onClick={() => sendMessage()}
            disabled={inputText.trim() === '' && !imageFile}
            aria-label="Enviar mensaje"
            title="Enviar"
          >
            <svg className="send-icon" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;