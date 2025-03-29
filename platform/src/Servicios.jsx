'use client'

export default function Servicios() {
  const servicios = [
    {
      icon: '🌬️',
      title: 'Monitoreo de calidad del aire',
      description:
        'Obtén datos en tiempo real sobre la calidad del aire en tus instalaciones para tomar decisiones informadas.',
    },
    {
      icon: '⚙️',
      title: 'Soluciones personalizadas',
      description:
        'Adaptamos nuestra tecnología a las necesidades específicas de tu empresa para garantizar resultados óptimos.',
    },
    {
      icon: '📊',
      title: 'Reportes detallados',
      description:
        'Genera reportes automáticos para cumplir con normativas y demostrar tu compromiso ambiental.',
    },
    {
      icon: '🛡️',
      title: 'Protección del equipo',
      description:
        'Reduce riesgos en el lugar de trabajo y protege la salud de tu equipo con nuestras soluciones avanzadas.',
    },
    {
      icon: '🌍',
      title: 'Impacto ambiental',
      description:
        'Contribuye a un entorno más sostenible y mejora tu impacto ambiental con nuestras herramientas.',
    },
    {
      icon: '🤝',
      title: 'Soporte continuo',
      description:
        'Recibe soporte personalizado para garantizar el éxito de la implementación de nuestras soluciones.',
    },
  ]

  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Nuestros Servicios
        </h2>
        <p className="mt-4 text-center text-lg text-gray-600">
          Descubre cómo podemos ayudarte a mejorar la calidad del aire y cumplir con tus objetivos ambientales.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map((servicio, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="h-12 w-12 flex-shrink-0 bg-indigo-600 text-white flex items-center justify-center rounded-full">
                {servicio.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{servicio.title}</h3>
              <p className="mt-2 text-gray-700">{servicio.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}