import { Pause, Skip, Mute } from '@/components/ui/control_button';
import React, { useEffect, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { Mosaic } from 'react-mosaic-component';
import { toast } from 'sonner';

import './../styles/react-mosaic-component.css';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';

/*
 * {0} represents the channelId
 * gets current overlays state
 */
var OVERLAY_API = 'https://api.streamelements.com/kappa/v3/overlays/{0}/action'
/*
 * {0} represents the channelId
 * gets current activites
 */
var ACTIVITIES_API = 'https://api.streamelements.com/kappa/v2/activities/{0}'
/**
 * activities to become from streamelements
 */
const REQUEST_TYPES = JSON.stringify(['tip', 'subscriber', 'cheer']);

const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
    a: <div id='first' className='text-white overflow-y-scroll'>
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
    </div>,
}

interface PanelProps {
    channelId: string;
}

export default function Panel({ channelId }: PanelProps) {
    const [isPaused, setPaused] = useState(false);
    const [isMuted, setMuted] = useState(false);
    const [isAlertVisible, setAlertVisible] = useState(false);

    const togglePause = () => {
        setPaused(!isPaused);
    }

    const toggleMute = () => {
        setMuted(!isMuted);
    }

    const animation = useSpring({
        from: { opacity: 0, transform: 'translateY(100%)' },
        to: { opacity: isAlertVisible ? 1 : 0, transform: isAlertVisible ? 'translateY(0%)' : 'translateY(100%)' },
        config: { duration: 500 },
        immediate: !isAlertVisible
    });

    useEffect(() => {
        const overlayToast = toast.loading('Retrieving overlay data...', {
            style: {
                background: 'black',
                borderWidth: '0.5px',   
                borderColor: 'gray',
                color: 'white'
            },
            duration: 3 * 1000
        });
        loadState(channelId, setPaused, setMuted)
        .then(() => {   
            toast.success('Retrieved overlay data', {
                id: overlayToast,
                style: {
                    background: 'rgb(1, 31, 16)',
                    borderWidth: '0.5px',   
                    borderColor: 'rgb(2, 62, 30)',
                    color: 'rgb(93, 244, 169)'
                }
            });
        })
        .catch(error => {
            toast.warning('Could not retrieve overlay data', {
                id: overlayToast,
                style: {
                    background: 'rgb(44, 6, 8)',
                    borderWidth: '0.5px',   
                    borderColor: 'rgb(76, 4, 9)',
                    color: 'rgb(254, 158, 161)'
                },
                description: error
            });
        });

        const activitiesToast = toast.loading('Loading activities...', {
            style: {
                background: 'black',
                borderWidth: '0.5px',   
                borderColor: 'gray',
                color: 'white'
            },
            duration: 3 * 1000
        });
        fetchActivities(channelId, 14)
        .then(() => {
            toast.success('Fetched activities', {
                id: activitiesToast,
                style: {
                    background: 'rgb(1, 31, 16)',
                    borderWidth: '0.5px',   
                    borderColor: 'rgb(2, 62, 30)',
                    color: 'rgb(93, 244, 169)'
                }
            });
        })
        .catch(error => {
            toast.warning('Could not fetch activites', {
                id: activitiesToast,
                style: {
                    background: 'rgb(44, 6, 8)',
                    borderWidth: '0.5px',   
                    borderColor: 'rgb(76, 4, 9)',
                    color: 'rgb(254, 158, 161)'
                },
                description: error
            });
        })
    }, [channelId]);

    useEffect(() => {
        setAlertVisible(isPaused || isMuted);
    }, [isPaused, isMuted])

    return (
        <>
        <div className='select-none h-screen overflow-hidden fixed top-0 left-0 w-full'>
            <header className='w-full fixed z-20 flex gap-2 left-0 top-0 p-3'>
                <div className='flex gap-2'>
                    <Pause channelId={channelId} isPaused={isPaused} callback={togglePause} className='px-4 w-14 h-9 bg-color_darkblue border-color_gray border-2 hover:border-color_purple text-white'></Pause>
                    <Skip channelId={channelId} className='px-4 w-14 h-9 bg-color_darkblue border-color_gray border-2 hover:border-color_purple text-white'></Skip>
                    <Mute channelId={channelId} isMuted={isMuted} callback={toggleMute} className='px-4 w-14 h-9 bg-color_darkblue border-color_gray border-2 hover:border-color_purple text-white'></Mute>
                </div>

                <Menubar className='h-9 bg-background/25 p-1 shadow-sm'>
                    <MenubarMenu>
                        <MenubarTrigger>Client</MenubarTrigger>
                    
                        <MenubarContent>
                            <MenubarItem>Info</MenubarItem>
                            <MenubarItem>Restart Setup</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>Split Screen</MenubarTrigger>
                    
                        <MenubarContent>
                            <MenubarItem>switch horizontal/vertical</MenubarItem>
                            <MenubarItem>top/left, types switch</MenubarItem>
                            <MenubarItem>bottom/right, types switch</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>

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
async function loadState(channelId: string, setPaused: (paused: boolean) => void, setMuted: (muted: boolean) => void) {
    return new Promise<void>(async (resolve, reject) => {
        fetch(OVERLAY_API.replace('{0}', channelId), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => {
            if (!response.ok) {  
                reject('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);
            setPaused(data.paused);
            setMuted(data.muted);
            resolve();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        })
    });
}

async function fetchActivities(channelId: string, days: number) {
    return new Promise<void>(async (resolve, reject) => {
        console.log('Start fetching of activites');
        const started: number = Date.now();

        const current: Date = new Date();
        current.setDate(current.getDate() + 1);

        const fetched: any[] = [];

        for (let i = 0; i < days; i++) {
            const before: string = current.toISOString().split('T')[0];
            current.setDate(current.getDate() - 1);
            const after: string = current.toISOString().split('T')[0];

            fetch(ACTIVITIES_API.replace('{0}', channelId) + `?after=${after}&before=${before}&limit=150&types=${REQUEST_TYPES}&origin=feed`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(response => {
                if (!response.ok) {
                    reject('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                data.forEach((document: any) => {
                    if (document["_id"] && document["type"]) {
                        fetched.push(document);
                    }
                });
            })
            .catch(error => {
                console.log(`Failed to fetch data for ${current}`, error);
            });

            await new Promise(resolve => setTimeout(resolve, 25));
        }

        console.log(`Fetched ${fetched.length} activities in the last ${days} (+ today) days`);

        fetched.forEach((_document) => {
            //
        })

        const end: number = Date.now();
        console.log(`Done! Needed ${end - started} ms`);

        resolve();
    });
}