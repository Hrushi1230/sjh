import React from 'react';
import ReactDOM from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import App from './App';
import './index.css';

gsap.registerPlugin(ScrollTrigger);
if (typeof window !== 'undefined') {
  (window as any).gsap = gsap;
  (window as any).ScrollTrigger = ScrollTrigger;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
