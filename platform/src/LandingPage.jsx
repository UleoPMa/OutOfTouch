'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import "./App.css"

const navigation = [
  { name: 'Servicios', href: '/servicios' },
  { name: 'Sobre nosotros', href: '#' },
  { name: 'FAQ', href: '#' },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-GRAY-50">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Green Flow</span>
              <img
                alt="Logo de Green Flow"
                src="https://drive.google.com/file/d/1guRT5sp-wwIIL7c34-AjlY8k-fTgtZ81/view"
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/signUp" className="text-sm/6 font-semibold text-gray-900">
              Empezar <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-50 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className="relative isolate pt-14">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="py-24 sm:py-32 lg:pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-balance text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Cumple normativas, protege a tu equipo y mejora tu impacto ambiental
              </h1>
              <p className="mt-7 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
              Monitorea la calidad del aire en tiempo real, protege a tu equipo y cumple con 
              las normativas ambientales sin complicaciones. Nuestra tecnología te ofrece datos 
              precisos para reducir riesgos, optimizar espacios y demostrar tu compromiso con un
               entorno más seguro y sostenible.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Comienza ahora
                </a>
                <a href="#" className="text-sm/6 font-semibold text-gray-900">
                  Conoce más <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      <div className="relative py-16">
              <img
                src="https://realestatemarket.com.mx/images/articles/130-parques-industriales/082-parque-industrial-queretaro/084-piq-es-un-desarrollo.jpg"
                alt="Separador decorativo"
                className="w-full h-45 object-cover"
              />
      </div>

      <div className=" py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          ¿Por qué elegirnos?
        </h2>
        <p className="mt-4 text-center text-lg text-gray-600">
          Descubre las ventajas de trabajar con nosotros y cómo podemos ayudarte a mejorar tu entorno.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center">
            <div className="h-12 w-12 flex-shrink-0 bg-indigo-600 text-white flex items-center justify-center rounded-full">
              🌱
            </div>
            <p className="ml-4 text-gray-700">
              Cumple con normativas ambientales fácilmente y sin complicaciones.
            </p>
          </div>
          <div className="flex items-center">
            <div className="h-12 w-12 flex-shrink-0 bg-indigo-600 text-white flex items-center justify-center rounded-full">
              📊
            </div>
            <p className="ml-4 text-gray-700">
              Obtén datos precisos en tiempo real para tomar decisiones informadas.
            </p>
          </div>
          <div className="flex items-center">
            <div className="h-12 w-12 flex-shrink-0 bg-indigo-600 text-white flex items-center justify-center rounded-full">
              🛡️
            </div>
            <p className="ml-4 text-gray-700">
              Protege a tu equipo y reduce riesgos en el lugar de trabajo.
            </p>
          </div>
          <div className="flex items-center">
            <div className="h-12 w-12 flex-shrink-0 bg-indigo-600 text-white flex items-center justify-center rounded-full">
              🌍
            </div>
            <p className="ml-4 text-gray-700">
              Mejora tu impacto ambiental y demuestra tu compromiso con la sostenibilidad.
            </p>
          </div>
          <div className="flex items-center">
            <div className="h-12 w-12 flex-shrink-0 bg-indigo-600 text-white flex items-center justify-center rounded-full">
              ⚙️
            </div>
            <p className="ml-4 text-gray-700">
              Tecnología avanzada que se adapta a tus necesidades específicas.
            </p>
          </div>
          <div className="flex items-center">
            <div className="h-12 w-12 flex-shrink-0 bg-indigo-600 text-white flex items-center justify-center rounded-full">
              🤝
            </div>
            <p className="ml-4 text-gray-700">
              Soporte personalizado para garantizar tu satisfacción.
            </p>
          </div>
        </div>
      </div>
    </div>
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between">
          <p>&copy; 2025 Green Flow. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400">Facebook</a>
            <a href="#" className="hover:text-gray-400">Twitter</a>
            <a href="#" className="hover:text-gray-400">LinkedIn</a>
          </div>
        </div>
      </div>
</footer>
    </div>
  )
}