import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { registerLicense } from '@syncfusion/ej2-base';
  
import './index.css';
import App from './App.jsx';


registerLicense('Ngo9BigBOggjHTQxAR8/V1JHaF5cWWdCekx3QHxbf1x2ZFxMZVxbRX5PMyBoS35RcEVgWHleeXFWR2NVUkVzVEFe');

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
