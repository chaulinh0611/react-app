import { Button } from '@/shared/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ErrorPage2 = () => {
    return (
        <div className="grid min-h-dvh items-center xl:grid-cols-2 w-3/4 mx-auto">
            <div className="flex flex-col p-16">
                <div className="mb-8 flex items-center justify-center gap-2 xl:justify-start">
                    <div className="bg-primary flex size-8 items-center justify-center rounded-lg">
                        <svg
                            className="text-primary-foreground size-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <Link to="/dashboard" className="text-xl font-bold">
                        Kanby
                    </Link>
                </div>

                <div className="mt-8 flex flex-1 flex-col items-center justify-center text-center xl:items-start xl:text-start">
                    <div className="mb-3 flex items-center gap-3">
                        <span className="text-5xl font-semibold">404</span>
                    </div>
                    <h1 className="mb-2 text-4xl font-bold">Page Not Found</h1>
                    <p>Oops! The page you're trying to access doesn't exist.</p>
                    <Button className="mt-8 flex cursor-pointer items-center gap-2">
                        <ArrowLeft className="size-4"></ArrowLeft>
                        <Link to="/dashboard">Go Back Home</Link>
                    </Button>
                </div>
            </div>
            <img
                src="../../public/Scrum.png"
                alt="Scrum"
                className="hidden bg-cover object-cover xl:inline dark:brightness-[0.95] dark:invert"
            />
        </div>
    );
};

export default ErrorPage2;
