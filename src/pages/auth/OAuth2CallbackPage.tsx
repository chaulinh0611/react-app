import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';
import { useAnimatedToast } from '@/shared/ui/animated-toast';

export default function OAuth2CallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addToast } = useAnimatedToast();

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token || token === 'null') {
            addToast({
                title: 'Login Failed',
                message: 'Google authentication failed. Please try again.',
                type: 'error',
            });
            navigate('/login', { replace: true });
            return;
        }

        localStorage.setItem('accessToken', token);
        addToast({
            title: 'Login Successful',
            message: 'You have successfully logged in with Google.',
            type: 'success',
        });
        navigate('/dashboard', { replace: true });
    }, [addToast, navigate, searchParams]);

    return <LoadingSpinner />;
}
