
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button/button";
import { Label } from "@/shared/ui/label";
import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

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
export default function LoginForm(){
    const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        // const [accessToken, setAccessToken] = useState("");

        async function submit(){

            setEmail("this is email");
            setPassword("this is password");
            console.log(email, password);
            const url = "http://localhost:8080/api/auth/login";
            // const config = {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         email: email,
            //         password: password,
            //     }),
    
            // }
            

            // )
            try{
                // const response = await fetch(url, config);
                const response = await axios.post(url, {
                    email: email,
                    password: password,
                });
                // const data = await response.json();
                // console.log(data);
                const [accessToken, refreshToken] = response.data.tokens;
                localStorage.setItem("accessToken", JSON.stringify(accessToken));
                localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
                console.log(response.data);
            }catch{
                console.log("Error");
            }
            // fetch(url, config).then(res => res.json().then(data => {
            //     console.log(data);
            // }))
        }
        // async function getUserInfo(){
        //     try{
        //     const response = await axios.get("http://localhost:8080/api/users/me", {
        //     headers: {
        //         Authorization: `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`,
        //     },
        //     });

        //     console.log(response.data);
        // }   catch{
        //     console.log("Error");
        // }   
        // }

        function callBackExample(){
            console.log("Call back example");
        }
        useEffect(() => {
            callBackExample();
        }, []);
    
    return<> <Email>
               <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
            </Email>
            <Password>
                <div>
                    <Label>Password</Label>
                    <a href="#">Forgot your password?</a>
                </div>
                <Input type="password"></Input>
            </Password>
            <LoginButton onClick={submit}>Login</LoginButton>
            </>
}