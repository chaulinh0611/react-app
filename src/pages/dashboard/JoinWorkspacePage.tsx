import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAnimatedToast } from '@/shared/ui/animated-toast';

export default function JoinWorkspacePage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { addToast } = useAnimatedToast();

    useEffect(() => {
        const token = params.get('token');

        if (!token) return;

        const join = async () => {
            try {
                const res = await axios.get(`/workspaces/join?token=${token}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                const workspaceId = res.data.workspaceId;

                navigate(`/workspace/${workspaceId}`);
            } catch (err) {
                addToast({
                    message: 'Invalid or expired invite link: ' + (err as Error).message,
                    type: 'error',
                });
                navigate('/');
            }
        };

        join();
    }, []);

    return <div className="flex items-center justify-center h-screen">Joining workspace...</div>;
}
