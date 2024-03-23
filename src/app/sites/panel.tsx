import { Pause, Skip, Mute } from '@/components/ui/control_button';
import React, { useState } from 'react';
import { Mosaic } from 'react-mosaic-component';

import './../styles/react-mosaic-component.css';

const ELEMENT_MAP: { [viewId: string]: JSX.Element } = {
    a: <div className='text-white'>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
    </div>,
    b: <div className='text-white overflow-scroll'>
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

    return (
        <>
        <div className='h-screen fixed w-full' id='panel'>
            <header id='controls' className='p-3 flex gap-3'>
                <Pause channelId={channelId} isPaused={isPaused} callback={togglePause} className='px-6 bg-color_darkblue border-color_gray border-2 hover:border-color_purple text-white'></Pause>
                <Skip channelId={channelId} className='px-6 bg-color_darkblue border-color_gray border-2 hover:border-color_purple text-white'></Skip>
                <Mute channelId={channelId} isMuted={isMuted} callback={toggleMute} className='px-6 bg-color_darkblue border-color_gray border-2 hover:border-color_purple text-white'></Mute>
            </header>

            <Mosaic<string>
                renderTile={(id) => ELEMENT_MAP[id]}
                initialValue={{
                    direction: 'column',
                    first: 'a',
                    second: 'b',
                    splitPercentage: 50
                }} />

            {(isPaused || isMuted) && (
                <p className='font-bold text-black text-center bg-red-500 absolute bottom-0 inset-x-0'>
                    ALERTS {isPaused && 'PAUSED'} {isPaused && isMuted && ' & '} { isMuted && 'MUTED' }
                </p>
            )}
        </div>
        </>
    )
}