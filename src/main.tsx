import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <link rel="preconnect" href="https://rsms.me/"/>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"/>
        <App/>
    </React.StrictMode>,
)
