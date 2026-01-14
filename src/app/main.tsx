import AxiosInterceptor from "@/shared/config/axiosInterceptor";
AxiosInterceptor();

import App from './App'
import { createRoot } from 'react-dom/client'
// import { StrictMode } from 'react'
import '../index.css'

createRoot(document.getElementById("root")!).render(
//   <StrictMode>
    <App />
//   </StrictMode>
);
