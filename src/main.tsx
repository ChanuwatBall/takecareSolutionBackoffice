import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { PhotoProvider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> 
    <PhotoProvider>
    <App />
    </PhotoProvider>
    </BrowserRouter>
  </StrictMode>,
)
