import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { registerLicense } from '@syncfusion/ej2-base';
  
import './index.css';
import App from './App.jsx';


registerLicense('Ngo9BigBOggjHTQxAR8/V1JGaF1cXmhLYVJ+WmFZfVhgfF9CaVZVTWY/P1ZhSXxVdkdiWH1edH1RT2JYV0R9XEA=');

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
