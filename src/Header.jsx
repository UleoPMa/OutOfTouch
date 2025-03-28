import { Button } from "@/components/ui/button";
import "./App.css"

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b shadow-md bg-white">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <span className="text-lg font-bold">Nombre del Proyecto</span>
      </div>
      <nav className="hidden md:flex gap-6 text-gray-700">
        <a href="#services" className="hover:text-black">Services</a>
        <a href="#about" className="hover:text-black">About Us</a>
        <a href="#faq" className="hover:text-black">FAQ</a>
      </nav>
      <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
        Begin <span className="ml-1">↗</span>
      </Button>
    </header>
  );
}
