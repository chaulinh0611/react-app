import AxiosInterceptor from '@/shared/config/axiosInterceptor';
AxiosInterceptor();

import App from './App';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import '../index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { Toaster } from '@/shared/ui/sonner';
import { AnimatedToastProvider } from '@/shared/ui/animated-toast';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AnimatedToastProvider>
                <App />
            </AnimatedToastProvider>
            <Toaster />
        </QueryClientProvider>
    </StrictMode>,
);
