import React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate
} from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CheckPage from './pages/CheckPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="/home" replace />} />
      <Route path="home" element={<HomePage />} />
      <Route path="check" element={<CheckPage />} />
      <Route path="history" element={<HistoryPage />} />
      <Route path="about" element={<AboutPage />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;