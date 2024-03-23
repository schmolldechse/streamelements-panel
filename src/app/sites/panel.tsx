import { Pause, Skip, Mute } from '@/components/ui/control_button';
import React, { useEffect, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { Mosaic } from 'react-mosaic-component';
import { toast } from 'sonner';

import './../styles/react-mosaic-component.css';

/*
 * {0} represents the channelId
 * gets current overlays state
 */
var API_URL = 'https://api.streamelements.com/kappa/v3/overlays/{0}/action'

const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
    a: <div id='first' className='text-white overflow-y-scroll'>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
    </div>,
    b: <div id='second' className='text-white overflow-y-scroll'>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
        <p>lol</p>
    </div>,
}

interface PanelProps {
    channelId: string | undefined;
}

export default function Panel({ channelId }: PanelProps) {
    const [isPaused, setPaused] = useState(false);
    const [isMuted, setMuted] = useState(false);

    const togglePause = () => {
        setPaused(!isPaused);
    }

    const toggleMute = () => {
        setMuted(!isMuted);
    }

    const animation = useSpring({
        from: { transform: 'transitionY(100%)' },
        to: { transform: 'transitionY(0%)' },
        config: { duration: 500 },
    });

    useEffect(() => {
        loadState(channelId, setPaused, setMuted);
    }, [channelId]);

    return (
        <>
        <div className='select-none h-screen overflow-hidden fixed top-0 left-0 w-full'>
            <header className='w-full fixed z-20 flex gap-2 left-0 top-0 p-3'>
                <Pause channelId={channelId} isPaused={isPaused} callback={togglePause} className='px-6 bg-color_darkblue border-color_gray border-2 hover:border-color_purple text-white'></Pause>
                <Skip channelId={channelId} className='px-6 bg-color_darkblue border-color_gray border-2 hover:border-color_purple text-white'></Skip>
                <Mute channelId={channelId} isMuted={isMuted} callback={toggleMute} className='px-6 bg-color_darkblue border-color_gray border-2 hover:border-color_purple text-white'></Mute>
            </header>

        <div className='h-[calc(100vh-50px)] mt-[50px]'>
            <Mosaic<string>
                renderTile={(id) => ELEMENT_MAP[id]}
                initialValue={{
                    direction: 'column',
                    first: 'a',
                    second: 'b',
                    splitPercentage: 50
                }} 
                />
        </div>

        {(isPaused || isMuted) && (
            <animated.div
                className='w-full h-6 uppercase font-bold bg-red-500 fixed bottom-0 z-50'
                style={animation}> 
                <p className='text-black text-center'>
                    ALERTS {isPaused && 'PAUSED'} {isPaused && isMuted && ' & '} { isMuted && 'MUTED' }
                </p>
            </animated.div>
        )}
        </div>
            
        </>
    )
}

// loads current state of streamelements, possible are [paused / unpaused, muted / unmuted]
async function loadState(channelId, setPaused, setMuted) {
    const toastId = toast.loading('Loading overlay data...', {
        style: {
            background: 'black',
            borderWidth: '0.5px',   
            borderColor: 'gray',
            color: 'white'
        },
        duration: 3 * 1000
    });

    fetch(API_URL.replace('{0}', channelId), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => {
        if (!response.ok) {         
            toast.warning('Could not retrieve overlay data', {
                id: toastId,
                style: {
                    background: 'rgb(44, 6, 8)',
                    borderWidth: '0.5px',   
                    borderColor: 'rgb(76, 4, 9)',
                    color: 'rgb(254, 158, 161)'
                }
            });

            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response:', data);
        setPaused(data.paused);
        setMuted(data.muted);   

        toast.success('Retrieved overlay data', {
            id: toastId,
            style: {
                background: 'rgb(1, 31, 16)',
                borderWidth: '0.5px',   
                borderColor: 'rgb(2, 62, 30)',
                color: 'rgb(93, 244, 169)'
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);  

        toast.warning('Could not retrieve overlay data', {
            id: toastId,
            style: {
                background: 'rgb(44, 6, 8)',
                borderWidth: '0.5px',   
                borderColor: 'rgb(76, 4, 9)',
                color: 'rgb(254, 158, 161)'
            }
        });
    })
}