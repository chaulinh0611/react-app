import { Button } from '@/shared/ui/button'
import { useLogin } from '../model/useLogin';

export function OAuthButton() {
    const {loginWithGoogle} = useLogin();

    const handleGoogleLogin = async () => {
        try {
            loginWithGoogle();
        } catch (error) {
            console.error('Google login failed:', error);
        }
    };

    return (
        <div>
            <Button
                variant="outline"
                className="w-full mt-2 hover:bg-grey-200! cursor-pointer rounded-[3px]!"
                onClick={handleGoogleLogin}
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                    className="w-5 h-5 mr-2"
                    alt=""
                />
                Continue with Google
            </Button>

        </div>
    )
}
