import { Card, CardHeader } from '@/shared/ui/card';

export const PrivateBoardError = () => {
    return (
        <Card className="w-[800px] mx-auto mt-30">
            <CardHeader className="flex flex-col items-center">
                <img className="w-32" src="https://trello.com/assets/3c7105ff523d79abba48.svg" />
                <h1 className="text-5xl font-bold">This board is private</h1>
                <p className="text-lg text-center mt-5 w-[600px]">
                    Send a request to this board’s admins to get access. If you’re approved to join,
                    you'll receive an email.
                </p>
            </CardHeader>
        </Card>
    );
};
