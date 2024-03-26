import { io, Socket } from 'socket.io-client';
import { Activity, Cheer, Follower, Host, Raid, Subscription, Tip, User } from '../service/objects';

let socket: Socket;

const EVENTS = {
    TOGGLE_QUEUE: 'overlay:togglequeue',
    MUTE: 'overlay:mute',
};

/*
 * {0} represents the channelId
 * gets current activites
 */
var ACTIVITIES_API = 'https://api.streamelements.com/kappa/v2/activities/{0}'
/**
 * activities to become from streamelements
 */
const REQUEST_TYPES = JSON.stringify(['tip', 'subscriber', 'cheer', 'follower', 'host', 'raid']);
/**
 * Fetched activities
 */
let fetchedActivities: (Tip | Subscription | Cheer | Follower | Host | Raid)[] = [];

function initialize({ token }: { token: string }, setData: (data: string) => void): Promise<Boolean> {
    return new Promise(resolve => {
        socket = io('https://realtime.streamelements.com', {
        transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            reconnection: true,
        });
    
        socket.on('connect', () => {
            console.log('Connected to streamelements websocket'); 
            socket.emit('authenticate', { method: 'jwt', token: token });
        });
        socket.on('disconnect', () => {
            console.log('Disconnected from streamelements websocket');
        });
        socket.on('authenticated', (data) => {
            const {
              channelId
            } = data;
            console.log('Connected with streamelements account ' + channelId);
            setData(channelId);

            resolve(true);
        });
        socket.on('unauthorized', () => {
            console.log('Given token was not valid or correct');

            resolve(false);
        })
    })
}

function initPauseEvent(setPaused: (paused: boolean) => void) {
    if (!socket) throw new Error('Socket has not been initialized yet');
    socket.on(EVENTS.TOGGLE_QUEUE, (data) => {
        console.log('Received an overlay update (pause/unpause alerts):', data);
        setPaused(data);
    })
}

function initMuteEvent(setMuted: (muted: boolean) => void) {
    if (!socket) throw new Error('Socket has not been initialized yet');
    socket.on(EVENTS.MUTE, (data) => {
        console.log('Received an overlay update (mute/unmute alerts):', data);
        setMuted(data.muted);
    })
}

function initIncoming(callback: (result: any) => void) {
    if (!socket) throw new Error('Socket has not been initialized yet');
    socket.on('event', (data) => {
        fetchActivity(data, (result) => {
            if (result === null) { 
                console.log('Skipping nulled result');
                return;
            }
            fetchedActivities.unshift(result);
            console.log('Fetched incoming activity:', result, `Total: ${fetchedActivities.length} activities`);
            callback(fetchedActivities);
        });
    });
}

function getSocket() {
    if (!socket) throw new Error('Socket has not been initialized yet');
    return socket;
}

async function fetchLatest(channelId: string, days: number) {
    return new Promise<any>(async (resolve, reject) => {
        console.log('Start fetching of activites');
        const started: number = Date.now();

        const current: Date = new Date();
        current.setDate(current.getDate() + 1);

        const fetched: any[] = [];

        for (let i = 0; i < days; i++) {
            const before: string = current.toISOString().split('T')[0];
            current.setDate(current.getDate() - 1);
            const after: string = current.toISOString().split('T')[0];

            fetch(ACTIVITIES_API.replace('{0}', channelId) + `?after=${after}&before=${before}&limit=300&types=${REQUEST_TYPES}&origin=feed`, {
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

        console.log(`Received ${fetched.length} activities in the last ${days} (+ today) days`);

        fetched.forEach((_document) => {
            fetchActivity(_document, (result) => {
                if (result === null) { 
                    console.log('Skipping nulled result');
                    return;
                }
                fetchedActivities.push(result);
            });
        })
        console.log(`Fetched ${fetchedActivities.length} activities`);

        const end: number = Date.now();
        console.log(`Done! Needed ${end - started} ms`);

        resolve(fetchedActivities);
    });
}

function fetchActivity(document: any, result: (result: any) => void) {
    if (document === null) throw new Error('Activity is null');

    let type: string = document['type'];
    if (!type) {
        result(null);
        throw new Error('Type is missing or invalid');
    }

    switch (type) {
        case 'follower':
            result(new Follower(
                new Activity(document['createdAt'], document['provider'], document['channel'], type, document['_id'], 'Followers'),
                new User(document['data']['username'])
            ));
            break;
        case 'tip':
            result(new Tip(
                document['data']['tipId'],
                document['data']['amount'],
                document['data']['currency'],
                document['data']['message'],
                new Activity(document['createdAt'], document['provider'], document['channel'], type, document['_id'], 'Tips'),
                new User(document['data']['username'])
            )); 
            break;
        case 'subscriber':
            result(new Subscription(
                document['data']['amount'],
                document['data']['tier'],
                document['data']['message'],
                document['data']['gifted'],
                new Activity(document['createdAt'], document['provider'], document['channel'], type, document['_id'], document['data']['gifted'] as boolean ? 'Subgifts' : 'Subscriptions'),
                new User(document['data']['username']),
                new User(document['data']['sender'])
            ));
            break;
        case 'cheer':
            result(new Cheer(
                document['data']['amount'],
                document['data']['message'],
                new Activity(document['createdAt'], document['provider'], document['channel'], type, document['_id'], 'Cheers'),
                new User(document['data']['username'])
            ));
            break;
        case 'host':
            result(new Host(
                document['data']['amount'],
                new Activity(document['createdAt'], document['provider'], document['channel'], type, document['_id'], 'Hosts'),
                new User(document['data']['username'])
            ));
            break;
        case 'raid':
            result(new Raid(
                document['data']['amount'],
                new Activity(document['createdAt'], document['provider'], document['channel'], type, document['_id'], 'Raids'),
                new User(document['data']['username'])
            ));
            break;
        default:
            console.log('Unknown type:', type);
            result(null);
            break;
    }
}

function emptyActivities() {
    fetchedActivities = [];
}

export { emptyActivities, initialize, initPauseEvent, initMuteEvent, initIncoming, getSocket, fetchLatest, fetchActivity };