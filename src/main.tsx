
import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'

// Add error boundary to catch any rendering errors
const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App successfully mounted");
  } catch (error) {
    console.error("Error rendering app:", error);
    // Show a fallback UI instead of the loading screen
    // Render a safe fallback UI without using innerHTML
    rootElement.innerHTML = '';
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.textAlign = 'center';

    const heading = document.createElement('h2');
    heading.textContent = 'Something went wrong';

    const paragraph = document.createElement('p');
    paragraph.textContent = 'The application failed to load. Please refresh the page or try again later.';

    const pre = document.createElement('pre');
    pre.style.background = '#f1f1f1';
    pre.style.padding = '10px';
    pre.style.textAlign = 'left';
    pre.style.marginTop = '20px';
    pre.textContent = (error as Error)?.message || 'Unknown error';

    container.appendChild(heading);
    container.appendChild(paragraph);
    container.appendChild(pre);
    rootElement.appendChild(container);
  }
} else {
  console.error("Root element not found");
}
