import { Pause, Skip, Mute } from '@/components/ui/control_button';
import React, { useEffect, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { Mosaic } from 'react-mosaic-component';
import { toast } from 'sonner';

import './../styles/react-mosaic-component.css';
import { fetchLatest, initIncoming, initMuteEvent, initPauseEvent } from '../service/streamelements';
import { ActivityPanel } from '@/components/ui/activity_panel';
import * as Dialog from '@radix-ui/react-dialog';

import { version, author } from './../../../package.json';
import Menu from '@/components/ui/menu';

/*
 * {0} represents the channelId
 * gets current overlays state
 */
var OVERLAY_API = 'https://api.streamelements.com/kappa/v3/overlays/{0}/action';

function createElementMap(activities: any[], settings: any): { [viewId: string]: () => JSX.Element } {
    return {
        a: () => <ActivityPanel activities={activities} settings={settings.a} />,
        b: () => <ActivityPanel activities={activities} settings={settings.b} />,
    };
}

interface PanelProps {
    channelId: string;
    setLoggedIn: any;
}

export default function Panel({ setLoggedIn, channelId }: PanelProps) {
    /**
     * Paused & muted states
     */
    const [isPaused, setPaused] = useState(false);
    const [isMuted, setMuted] = useState(false);
    const [isAlertVisible, setAlertVisible] = useState(false);
    
    const togglePause = () => {
        setPaused(!isPaused);
    }

    const toggleMute = () => {
        setMuted(!isMuted);
    }

    /**
     * Activity settings
     */
    /**
     * Activitiy Settings
     */
    const [settings, setSettings] = useState({
        a: { 
            Tips: true,
            Subscriptions: false,
            Subgifts: true,
            Raids: true,
            Hosts: true,
            Cheers: true,
            Followers: true,
        },
        b: {
            Tips: false,
            Subscriptions: true,
            Subgifts: false,
            Raids: false,
            Hosts: false,
            Cheers: false,
            Followers: false,
        }
    });

    /**
     * SplitScreen states
     */ 
    const [splitScreenEnabled, setSplitScreenEnabled] = useState(true);
    const [splitScreenHorizontal, setSplitScreenHorizontal] = useState(false);

    /**
     * Activity Panel rendering
     */
    const [activities, setActivities] = useState([]);
    const [elementMap, setElementMap] = useState(createElementMap(activities, settings));

    /**
     * Dialog State
     */
    const [dialogOpen, setDialogOpen] = useState(false);

    /**
     * Toggle activity
     * @param panel 
     * @param settingKey 
     * @param newValue 
     */
    const toggleSetting = (panel: string, settingKey: string, newValue: boolean) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [panel as keyof typeof prevSettings]: {
                ...prevSettings[panel as keyof typeof prevSettings],
                [settingKey]: newValue
            }
        }));
    };

    useEffect(() => {
        setElementMap(createElementMap(activities, settings));
    }, [settings]);

    /**
     * "coming in" effect of paused & muted alerts field
     */
    const animation = useSpring({
        from: { opacity: 0, transform: 'translateY(100%)' },
        to: { opacity: isAlertVisible ? 1 : 0, transform: isAlertVisible ? 'translateY(0%)' : 'translateY(100%)' },
        config: { duration: 500 },
        immediate: !isAlertVisible
    });

    /**
     * async fetching of overlay data & activities
     */
    const fetchData = async () => {
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
        fetchLatest(channelId, 60)
        .then((activities) => {
            setActivities(activities);         
            setElementMap(createElementMap(activities, settings));
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
    }

    useEffect(() => {
        fetchData();
    }, []);

    /**
     * displaying "paused & muted alerts" field
     */
    useEffect(() => {
        setAlertVisible(isPaused || isMuted);
    }, [isPaused, isMuted]);

    /**
     * initializing socket events
     */
    useEffect(() => {
        initPauseEvent(setPaused);
        initMuteEvent(setMuted);
        initIncoming((result) => {
            setActivities(result);
            setElementMap(createElementMap(result, settings));
        });
    }, []);

    return (
        <>
        <div className='select-none h-screen overflow-hidden fixed top-0 left-0 w-full'>
            <header className='w-full fixed z-20 flex gap-2 left-0 top-0 p-3'>
                <div className='flex gap-2'>
                    <Pause channelId={channelId} isPaused={isPaused} callback={togglePause} className='px-4 w-14 h-9 bg-color_darkblue border-color_gray border-2 hover:border-color_purple text-white'></Pause>
                    <Skip channelId={channelId} className='px-4 w-14 h-9 bg-color_darkblue border-color_gray border-2 hover:border-color_purple text-white'></Skip>
                    <Mute channelId={channelId} isMuted={isMuted} callback={toggleMute} className='px-4 w-14 h-9 bg-color_darkblue border-color_gray border-2 hover:border-color_purple text-white'></Mute>
                </div>

                <Menu 
                    setLoggedIn={setLoggedIn} 
                    setActivities={setActivities}
                    fetchData={fetchData}
                    setElementMap={setElementMap}
                    createElementMap={createElementMap}
                    settings={settings}
                    toggleSetting={toggleSetting}
                    splitScreenEnabled={splitScreenEnabled}
                    setSplitScreenEnabled={setSplitScreenEnabled}
                    splitScreenHorizontal={splitScreenHorizontal}
                    setSplitScreenHorizontal={setSplitScreenHorizontal}
                    setDialogOpen={setDialogOpen}
                />
            </header>

            <div className='h-[calc(100vh-50px)] mt-[50px]'>
                {splitScreenEnabled ? (
                    <Mosaic<string>
                        renderTile={(id, path) => elementMap[id]()}
                        initialValue={{
                            direction: splitScreenHorizontal ? 'row' : 'column',
                            first: 'a',
                            second: 'b',
                            splitPercentage: 50
                        }} 
                    />
                ) : (
                    <ActivityPanel activities={activities} settings={settings.b} />
                )}
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

            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className='fixed inset-0 bg-black/50 ' />
                    <Dialog.Content className='fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-color_darkblue border-color_gray border-2 px-6 py-4'>
                        <Dialog.Title className='text-white font-bold'>StreamElements-Panel</Dialog.Title>
                        <Dialog.Description className='text-gray-300 text-sm text-[11px]'>Third party StreamElements Panel</Dialog.Description>

                        <div className='pt-5 space-y-3'>
                            <p className='text-white font-semibold'>Version: {version}</p>
                            <p className='text-white font-semibold'>Author: {author}</p>
                            <p className='text-white font-semibold'>Plattform: {typeof navigator !== 'undefined' ? 'Web' : 'Client'}</p>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
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
};