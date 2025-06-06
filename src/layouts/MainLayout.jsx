import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="app">
      <header>Tu Header Aquí</header>
      <main>
        <Outlet /> {/* Esto renderiza las páginas hijas */}
      </main>
      <footer>Tu Footer Aquí</footer>
    </div>
  );
}