import * as React from 'react'

import { cn } from '@/lib/utils'
import { Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { GoogleLogin } from '@react-oauth/google'

import { useSignIn } from 'react-auth-kit'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { TOKEN_EXPIRATION_IN_MINUTES } from '@/lib/config'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type tokenProps = { data: { token: string; user: object } }
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const signIn = useSignIn()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 5000)
    }

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className='grid gap-2'>
                    <div className='grid gap-1'>
                        <Label className='sr-only' htmlFor='email'>
                            Email
                        </Label>
                        <Input
                            id='email'
                            placeholder='name@example.com'
                            type='email'
                            autoCapitalize='none'
                            autoComplete='email'
                            autoCorrect='off'
                            disabled={isLoading}
                        />

                        <Label className='sr-only' htmlFor='password'>
                            Password
                        </Label>
                        <Input
                            id='password'
                            placeholder='Password'
                            type='password'
                            autoCapitalize='none'
                            autoComplete='password'
                            autoCorrect='off'
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Circle className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        Login with Email
                    </Button>
                </div>
            </form>
            <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background px-2 text-muted-foreground'>
                        Or continue with
                    </span>
                </div>
            </div>
            {/* <Button variant='outline' type='button' disabled={isLoading}>
                {isLoading ? (
                    <Circle className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                    <Circle className='mr-2 h-4 w-4' />
                )}{' '}
                Google
            </Button> */}
            <div className='flex items-center justify-center'>
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        //console.log()
                        const res: tokenProps = await axios.post(
                            'auth/google/token',
                            {
                                token: credentialResponse.credential,
                            }
                        )
                        const { token, user } = res.data
                        if (
                            signIn({
                                token: token,
                                expiresIn: TOKEN_EXPIRATION_IN_MINUTES,
                                tokenType: 'Bearer',
                                authState: user,
                            })
                        ) {
                            // Redirect or do-something
                            navigate('/')
                        } else {
                            //Throw error
                            //TODO show error by toast
                            console.log('Login Failed')
                        }
                    }}
                    onError={() => {
                        console.log('Login Failed')
                    }}
                    useOneTap
                />
            </div>
        </div>
    )
}
