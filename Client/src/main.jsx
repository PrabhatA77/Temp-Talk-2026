import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AnimatePresence } from "framer-motion";

createRoot(document.getElementById('root')).render(
    <AnimatePresence>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AnimatePresence>
)
