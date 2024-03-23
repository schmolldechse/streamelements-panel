import React from "react";
import { Button } from "./button";

// {0} represents the channelId
var API_URL = 'https://api.streamelements.com/kappa/v3/overlays/{0}/action';

interface PauseProps {
    channelId: string,
    isPaused: boolean,
    callback: () => void,
    className: string;
}

export const Pause = ({ channelId, isPaused, callback, className }: PauseProps) => {
    const handle = () => {
        callback();
        togglePause(channelId, !isPaused);
    }

    return (
        <Button id="pause" onClick={handle} className={className}>
            {isPaused ? (
                <svg fill="red" width="24px" height="24px" viewBox="0 0 15 15">
                    <path d="M4.79 2.093A.5.5 0 0 0 4 2.5v10a.5.5 0 0 0 .79.407l7-5a.5.5 0 0 0 0-.814z"/>
                </svg>
            ) : (
                <svg fill="#DADBDD" width="24px" height="24px" viewBox="0 0 52 52">
                    <path d="M30 43c0 1 .9 2 2 2h4c1.1 0 2-1.1 2-2V9c0-1-.9-2-2-2h-4c-1.1 0-2 1.1-2 2zm-16 0c0 1 .9 2 2 2h4c1.1 0 2-1.1 2-2V9c0-1-.9-2-2-2h-4c-1.1 0-2 1.1-2 2z"/>
                </svg>     
            )}        
        </Button>
    )
};

function togglePause (channelId: string, isPaused: boolean): void {
    fetch(API_URL.replace('{0}', channelId), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ action: isPaused ? 'pause' : 'unpause' })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response:', data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    })
}

interface SkipProps {
    channelId: string,
    className: string;
}

export const Skip = ({ channelId, className }: SkipProps) => {
    const handle = () => {
        toggleSkip(channelId);
    }

    return (
        <Button id="skip" onClick={handle} className={className}>
            <svg fill='#DADBDD' width='24px' height='24px' viewBox='0 0 32 32'>
                <path d='M28.448 17.261 15.552 27.739C14.698 28.432 14 28.1 14 27v-6.938l-9.448 7.676C3.698 28.432 3 28.1 3 27V5c0-1.1.698-1.432 1.552-.739L14 11.937V5c0-1.1.698-1.432 1.552-.739l12.896 10.478c.854.693.854 1.829 0 2.522'/>
            </svg> 
        </Button>
    )
};

function toggleSkip (channelId: string): void {
    fetch(API_URL.replace('{0}', channelId), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ action: 'skip' })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response:', data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    })
}

interface MuteProps {
    channelId: string,
    isMuted: boolean,
    callback: () => void,
    className: string;
}

export const Mute = ({ channelId, isMuted, callback, className }: MuteProps) => {
    const handle = () => {
        callback();
        toggleMute(channelId, !isMuted);
    }

    return (
        <Button id="mute" onClick={handle} className={className}>
            {isMuted ? (
                <svg fill='red' width='24' height='24' viewBox='0 0 0.48 0.48'>
                    <path d='M.06.225v.09C.06.339.078.36.102.36h.069l.096.084Q.273.449.279.45C.285.451.285.45.288.447A.03.03 0 0 0 .3.426V.399L.084.183C.069.189.06.207.06.225m.24.06V.111Q.3.098.288.09H.279Q.273.089.267.096L.183.171.06.048l-.03.03.102.102L.3.348l.108.108.03-.03z'/>
                </svg>
            ) : (
                <svg fill='#DADBDD' width='24' height='24' viewBox='0 0 24 24'>
                    <path d='M11.553 3.064A.75.75 0 0 1 12 3.75v16.5a.75.75 0 0 1-1.255.555L5.46 16H2.75A1.75 1.75 0 0 1 1 14.25v-4.5C1 8.784 1.784 8 2.75 8h2.71l5.285-4.805a.75.75 0 0 1 .808-.13zM10.5 5.445l-4.245 3.86a.75.75 0 0 1-.505.195h-3a.25.25 0 0 0-.25.25v4.5c0 .138.112.25.25.25h3a.75.75 0 0 1 .505.195l4.245 3.86z'/>
                    <path d='M18.718 4.222a.75.75 0 0 1 1.06 0c4.296 4.296 4.296 11.26 0 15.556a.75.75 0 0 1-1.06-1.06 9.5 9.5 0 0 0 0-13.436.75.75 0 0 1 0-1.06'/><path d='M16.243 7.757a.75.75 0 1 0-1.061 1.061 4.5 4.5 0 0 1 0 6.364.75.75 0 0 0 1.06 1.06 6 6 0 0 0 0-8.485z'/>
                </svg>
            )}
        </Button>
    )
};

function toggleMute (channelId: string, isMuted: boolean): void {
    fetch(API_URL.replace('{0}', channelId), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ action: isMuted ? 'mute' : 'unmute' })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response:', data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    })
}