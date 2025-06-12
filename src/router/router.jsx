// src/router/router.jsx
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx'; // Añade la extensión .jsx
import HomePage from '../pages/HomePage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout><Outlet /></MainLayout>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;