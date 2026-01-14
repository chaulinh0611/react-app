import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthHandler() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            navigate('/login');
            return;
        }

        localStorage.setItem('accessToken', token);
        navigate('/dashboard');
    }, [searchParams, navigate]);

    return <p>Loading...</p>
}
