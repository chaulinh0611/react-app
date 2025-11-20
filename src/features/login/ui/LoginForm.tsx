import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button/button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/shared/api/authApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await authApi.login({ email, password })

            localStorage.setItem('accessToken', res.data.data.accessToken)
            localStorage.setItem('refreshToken', res.data.data.refreshToken)
            navigate('/dashboard')
        } catch (err) {
            console.error('Login failed:', err)
            alert('Đăng nhập thất bại. Vui lòng kiểm tra email hoặc mật khẩu!')
        }
    }

    const handleLoginWithGoogle = () => {
        window.location.href = 'http://localhost:3000/api/auth/google'
    }
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor='email'>Email</FieldLabel>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='m@example.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <div className='flex items-center'>
                                    <FieldLabel htmlFor='password'>Password</FieldLabel>
                                    <a
                                        href='#'
                                        className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id='password'
                                    type='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <Button type='submit'>Login</Button>
                                <Button variant='outline' type='button' onClick={handleLoginWithGoogle}>
                                    Login with Google
                                </Button>
                                <FieldDescription className='text-center'>
                                    Don&apos;t have an account? <a href='#'>Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
