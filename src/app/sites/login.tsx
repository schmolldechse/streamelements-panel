import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FloatingInput, FloatingLabel } from '@/components/ui/floating_label_input';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { initialize } from '../service/streamelements';
import { shell } from 'electron';

interface LoginProps {
    onLogin: (loggedIn: boolean) => void;
    setData: (channelId: string | undefined) => void;
}

export default function Login({ onLogin, setData }: LoginProps) {
    const handleLogin = (loggedIn: boolean) => {
        onLogin(loggedIn);
    }

    const tryCredentials = async () => {
        const toastId = toast.loading('Trying to connect...', {
            style: {
                background: 'black',
                borderWidth: '0.5px',   
                borderColor: 'gray',
                color: 'white'
            },
            duration: 3 * 1000
        });

        const inputField = document.getElementById('token') as HTMLInputElement;
        if (inputField === null) return;
        const token = inputField.value as string;
        if (token === '') return;

        const button = document.getElementById('login') as HTMLButtonElement;
        if (button === null) return;
        button.disabled = true;

        localStorage.setItem('token', token);

        initialize({ token: token }, setData)
            .then((success) => {
                if (success) {      
                    toast.success('Connected with StreamElements', {
                        id: toastId,
                        style: {
                            background: 'rgb(1, 31, 16)',
                            borderWidth: '0.5px',   
                            borderColor: 'rgb(2, 62, 30)',
                            color: 'rgb(93, 244, 169)'
                        }
                    });
                    handleLogin(true);
                } else {             
                    toast.warning('Could not connect with StreamElements', {
                        id: toastId,
                        style: {
                            background: 'rgb(44, 6, 8)',
                            borderWidth: '0.5px',   
                            borderColor: 'rgb(76, 4, 9)',
                            color: 'rgb(254, 158, 161)'
                        }
                    });
                }
            })
            .catch((error) => {
                console.error('An error occurred during connecting with streamelements websocket:', error);           
                toast.warning('Could not connect with StreamElements', {
                    id: toastId,
                    style: {
                        background: 'rgb(44, 6, 8)',
                        borderWidth: '0.5px',   
                        borderColor: 'rgb(76, 4, 9)',
                        color: 'rgb(254, 158, 161)'
                    }
                });
            })

        button.disabled = false;
    };

    const handleLinkClick = (url: string) => {
        window.api.openLink(url);
    };

    // direct login
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null) return;

        const inputField = document.getElementById('token') as HTMLInputElement;
        inputField.value = token as string;

        setTimeout(() => tryCredentials(), 50);
    }, [tryCredentials]);

    return (
        <div className='mt-10 p-3 w-full'>
            <Card className='bg-color_darkblue border-color_gray'>
                <CardHeader>
                    <CardTitle className='text-white'>Setup</CardTitle>
                    <CardDescription className='text-white'>Enter your StreamElements JWT-Token to continue. You can find it on the 
                        <a onClick={() => handleLinkClick('https://streamelements.com/dashboard/account/channels')} target='_blank' rel='noreferrer' className='color_purple hover:cursor-pointer'> account page </a> 
                        in the dashboard
                    </CardDescription>
                </CardHeader>

                <CardContent className='p-6 pt-0 flex gap-3 flex-col'>
                    <div className='flex gap-3 flex-row'>
                        <div className='relative w-full'>
                            <FloatingInput id='token' className='piss_of_white_shit bg-color_darkblue border-color_gray border-2 hover:border-color_purple active:border-color_purple text-white' type='password'/>      
                            <FloatingLabel htmlFor='token' className='bg-color_darkblue'>JWT-Token</FloatingLabel>
                        </div>

                        <Button className='bg-color_darkblue border-color_gray hover:border-color_purple border-2' onClick={handlePaste}>
                            <svg width='24px' height='24px' viewBox='0 0 24 24' fill='darkgray'>
                               <path d='M5.962 2.513a.75.75 0 01-.475.949l-.816.272a.25.25 0 00-.171.237V21.25c0 .138.112.25.25.25h14.5a.25.25 0 00.25-.25V3.97a.25.25 0 00-.17-.236l-.817-.272a.75.75 0 01.474-1.424l.816.273A1.75 1.75 0 0121 3.97v17.28A1.75 1.75 0 0119.25 23H4.75A1.75 1.75 0 013 21.25V3.97a1.75 1.75 0 011.197-1.66l.816-.272a.75.75 0 01.949.475z' />
                               <path d='M7 1.75C7 .784 7.784 0 8.75 0h6.5C16.216 0 17 .784 17 1.75v1.5A1.75 1.75 0 0115.25 5h-6.5A1.75 1.75 0 017 3.25v-1.5zm1.75-.25a.25.25 0 00-.25.25v1.5c0 .138.112.25.25.25h6.5a.25.25 0 00.25-.25v-1.5a.25.25 0 00-.25-.25h-6.5z' />
                            </svg>
                        </Button>
                    </div>

                    <Button id='login' className='bg-color_purple hover:bg-color_darkpurple' onClick={tryCredentials}>Connect</Button>
                </CardContent>
            </Card>
        </div>
    )
}

function handlePaste() {
    navigator.clipboard.readText().then(text => {
        const inputField = document.getElementById('token') as HTMLInputElement;
        if (!inputField) {
            console.error('Token input field not found');
            return;
        }
        inputField.value = text;
        console.log('Pasted text from clipboard into jwt-token field:', text)

        toast('Pasted from clipboard', {
            style: {
                background: 'black',
                borderWidth: '0.5px',   
                borderColor: 'gray',
                color: 'white'
            },
            duration: 5000
        });
      }).catch(err => {
        console.error('Could not read clipboard:', err);

        toast.error('Could not read clipboard', {
            style: {
                background: 'rgb(44, 6, 8)',
                borderWidth: '2px',   
                borderColor: 'rgb(38, 4, 6)',
                color: 'rgb(254, 158, 161)'
            },
            duration: 5000
        });
      });
}