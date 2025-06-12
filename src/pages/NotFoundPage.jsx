import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h1>404 - Página no encontrada</h1>
      <p>La página que buscas no existe o fue movida.</p>
      <button onClick={() => navigate('/')}>
        Volver al inicio
      </button>
    </div>
  );
}