
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: black;
    color: white;
    padding: 20px;
`;
const Card = styled.div`
    background-color: #292828ff;
    padding: 50px;
    border-radius: 10px;
    border: 1px solid #4c4c4cff;
    box-shadow: 0 4px 6px rgba(30, 30, 30, 1);
    width: 100%;
    max-width: 500px;
    text-align: center;
    margin-bottom: 20px;
`;
const Title = styled.h2`
    margin-bottom: 5px;
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-align: left;
`;
const Description = styled.p`
    margin-bottom: 30px;
    color: #aba9a9ff;
    text-align: left;
    font-size: 16px;
    line-height: 1.5;
`;

const Email = styled.div`
    margin-bottom: 25px;
    text-align: left;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    gap: 10px;
    input{
        background-color: #373636ff;}
`;

const Password = styled.div`
    margin-bottom: 25px;
    text-align: left;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    gap: 10px;
    div {
        display: flex;
        justify-content: space-between;
        align-items: center;
            }
    a {;
    color: #ebeaeaff;
        text-decoration: none;
        font-size: 14px;
        &:hover {
            text-decoration: underline;
        }
    }
        input{
        background-color: #373636ff;}
`;

const LoginButton = styled(Button)`
    width: 100%;
    padding: 10px;
    background-color: #f6f4f4ff;
    color: black;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    cursor: pointer;
    margin-bottom: 15px;
    &:hover {
        background-color: #d6d3d3ff;
    }
`;
const LoginGoogleButton = styled(Button)`
    width: 100%;
    padding: 10px;
    background-color: #373636ff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    cursor: pointer;
    margin-bottom: 25px;
    &:hover {
        background-color: #6a6969ff;
    }
`;
const SignUpLabel = styled.p`
    font-size: 15px;
    color: #efededff;
    gap: 10px;
    a {
        color: #ffffffff;
        text-decoration: underline;
    }
`;

export default function LoginPage(){
    return <>
    <Container>
        <Card>
            <Title>Login to your account</Title>
            <Description>Enter your email below to login to your account</Description>
            <Email>
               <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
            </Email>
            <Password>
                <div>
                    <Label>Password</Label>
                    <a href="#">Forgot your password?</a>
                </div>
                <Input type="password"></Input>
            </Password>
            <LoginButton>Login</LoginButton>
            <LoginGoogleButton>Login with Google</LoginGoogleButton>
            <SignUpLabel>Don't have an account? 
                <a href="#"> Sign up</a></SignUpLabel>
        </Card>
    </Container>
    </>
}