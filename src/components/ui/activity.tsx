import React, { useEffect, useState } from 'react';
import Linkify from 'react-linkify';

import { Button } from './button';
import { toast } from 'sonner';

interface ActivityProp {
    activity: any;
    index: number;
    channelId: string;
};

/**
 * @param {0} channelId
 * @param {1} activityId
 */
var API_URL = 'https://api.streamelements.com/kappa/v2/activities/{0}/{1}/replay';

const typeSvg = {
    Tips: '<svg fill="#46DCB3" height="18px" width="18px" viewBox="0 0 300.346 300.346"> <path d="M296.725 153.904a24.13 24.13 0 0 0-16.298-11.03c-6.753-1.189-13.704.559-19.14 4.835l-21.379 17.125a24.13 24.13 0 0 0-13.359-7.218 24.14 24.14 0 0 0-19.1 4.805l-12.552 9.921h-32.236a32.9 32.9 0 0 1-14.892-3.579l-11.486-5.861a63.8 63.8 0 0 0-31.385-6.908 63.75 63.75 0 0 0-40.554 16.666L2.455 229.328a7.56 7.56 0 0 0-.873 10.203l32.406 41.867a7.554 7.554 0 0 0 9.986 1.782l38.971-24.37a17.43 17.43 0 0 1 9.249-2.654h90.429c12.842 0 25.445-4.407 35.489-12.409l73.145-58.281c9.56-7.611 11.908-21.18 5.468-31.562m-79.913 20.39a8.87 8.87 0 0 1 7.112-1.787 8.9 8.9 0 0 1 4.087 1.856l-12.645 10.129a23 23 0 0 0-4.282-5.672zm65.026-.654-73.147 58.282a42 42 0 0 1-26.067 9.116h-90.43a32.54 32.54 0 0 0-17.266 4.954l-33.17 20.743-23.959-30.955 56.755-51.969a48.6 48.6 0 0 1 30.924-12.708 48.7 48.7 0 0 1 23.932 5.268l11.486 5.861a48.1 48.1 0 0 0 21.763 5.231h32.504c4.278 0 7.757 3.48 7.757 7.758a7.765 7.765 0 0 1-7.308 7.745l-90.45 5.252a7.56 7.56 0 0 0-7.11 7.985 7.55 7.55 0 0 0 7.986 7.109l90.45-5.252c9.461-.549 17.317-6.817 20.283-15.321l53.916-43.189a8.88 8.88 0 0 1 7.114-1.787 8.87 8.87 0 0 1 6.074 4.111 8.985 8.985 0 0 1-2.037 11.766m-133.28-41.971c31.886 0 57.827-25.941 57.827-57.827s-25.941-57.827-57.827-57.827-57.827 25.94-57.827 57.827 25.941 57.827 57.827 57.827m0-100.534c23.549 0 42.707 19.159 42.707 42.707s-19.159 42.707-42.707 42.707-42.707-19.159-42.707-42.707 19.159-42.707 42.707-42.707"/> <path d="M147.213 87.744c-2.24 0-4.618-.546-6.698-1.538a5.05 5.05 0 0 0-4.098-.105 5.16 5.16 0 0 0-2.884 3.02l-.204.569c-.87 2.434.204 5.131 2.501 6.274 2.129 1.06 4.734 1.826 7.398 2.182v2.162c0 2.813 2.289 5.101 5.171 5.101a5.107 5.107 0 0 0 5.102-5.101v-2.759c6.712-2.027 11.018-7.542 11.018-14.188 0-9.156-6.754-13.085-12.625-15.479-6.355-2.63-6.832-3.78-6.832-5.234 0-1.914 1.664-3.058 4.453-3.058 2.043 0 3.883.366 5.63 1.121a5 5 0 0 0 3.966.009 5.14 5.14 0 0 0 2.79-2.901l.204-.541c.97-2.56-.228-5.41-2.726-6.487-1.676-.723-3.51-1.229-5.46-1.508v-1.908a5.11 5.11 0 0 0-5.102-5.102 5.107 5.107 0 0 0-5.101 5.102v2.549c-6.511 1.969-10.53 7.12-10.53 13.561 0 8.421 6.76 12.208 13.342 14.789 5.579 2.262 6.045 4.063 6.045 5.574-.001 2.876-2.887 3.896-5.36 3.896"/> </svg>',
    Subscriptions: '<svg fill="#F5AF13" width="18px" height="18px" viewBox="0 0 100 100"> <path d="M91.532 39.844a2 2 0 0 0-1.888-1.343H61.482l-9.597-27.159a2 2 0 0 0-3.771 0l-9.598 27.159H10.357c-.851 0-1.609.539-1.891 1.343a2 2 0 0 0 .651 2.226l21.986 17.409-9.84 27.846a2.003 2.003 0 0 0 2.917 2.382l25.818-15.488 25.818 15.488a2.003 2.003 0 0 0 2.918-2.382l-9.84-27.846L90.886 42.07a2 2 0 0 0 .646-2.226"/> </svg>',
    Subgifts: '<svg fill="#F5AF13" width="18px" height="18px" viewBox="0 0 24 24"> <path d="M18 7h-.35A3.45 3.45 0 0 0 18 5.5a3.49 3.49 0 0 0-6-2.44A3.49 3.49 0 0 0 6 5.5 3.45 3.45 0 0 0 6.35 7H6a3 3 0 0 0-3 3v2a1 1 0 0 0 1 1h1v6a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-6h1a1 1 0 0 0 1-1v-2a3 3 0 0 0-3-3m-7 13H8a1 1 0 0 1-1-1v-6h4Zm0-9H5v-1a1 1 0 0 1 1-1h5Zm0-4H9.5A1.5 1.5 0 1 1 11 5.5Zm2-1.5A1.5 1.5 0 1 1 14.5 7H13ZM17 19a1 1 0 0 1-1 1h-3v-7h4Zm2-8h-6V9h5a1 1 0 0 1 1 1Z"/> </svg>',
    Cheers: '<svg height="18px" width="18px" viewBox="0 0 495 495" style="enable-background:new 0 0 495 495;"> <g> <polygon style="fill:#D5B4E8;" points="371.25,13.806 123.75,13.806 247.5,182.432 	"/> <polygon style="fill:#6D2C93;" points="247.5,182.432 247.5,481.194 495,182.432 	"/> <polygon style="fill:#933EC5;" points="495,182.432 371.25,13.806 247.5,182.432 	"/> <polygon style="fill:#B87FD9;" points="123.75,13.806 0,182.432 247.5,182.432 	"/> <polygon style="fill:#933EC5;" points="0,182.432 247.5,481.194 247.5,182.432 	"/> </g> </svg>',
    Followers: '<svg fill="#CA3433" width="18px" height="18px" viewBox="0 0 15 15"><path d="M13.91 6.75c-1.17 2.25-4.3 5.31-6.07 6.94a.5.5 0 0 1-.67 0C5.39 12.06 2.26 9 1.09 6.75-1.48 1.8 5-1.5 7.5 3.45c2.5-4.95 8.98-1.65 6.41 3.3"/></svg>',
    Hosts: '<svg fill="white" width="20px" height="20px" viewBox="0 0 100 100" ><path d="M80 71.2V74c0 3.3-2.7 6-6 6H26c-3.3 0-6-2.7-6-6v-2.8c0-7.3 8.5-11.7 16.5-15.2.3-.1.5-.2.8-.4.6-.3 1.3-.3 1.9.1C42.4 57.8 46.1 59 50 59s7.6-1.2 10.8-3.2c.6-.4 1.3-.4 1.9-.1.3.1.5.2.8.4 8 3.4 16.5 7.8 16.5 15.1"/><ellipse cx="50" cy="36.5" rx="14.9" ry="16.5"/></svg>',
    Raids: '<svg fill="#4682B4" width="18px" height="18px" viewBox="0 0 24 24"><path d="M18 11.74a1 1 0 0 0-.52-.63l-3.39-1.68.91-6.29a1 1 0 0 0-1.78-.75l-7 9a1 1 0 0 0-.18.87 1.05 1.05 0 0 0 .6.67l4.27 1.71-.91 6.22a1 1 0 0 0 .63 1.07.9.9 0 0 0 .37.07 1 1 0 0 0 .83-.45l6-9a1 1 0 0 0 .17-.81"/></svg>'
}

const typeColor = {
    Tips: '#46DCB3',
    Subscriptions: '#F5AF13',
    Subgifts: '#F5AF13',
    Cheers: '#A05AC3',
    Followers: '#CA3433',
    Hosts: 'white',
    Raids: '#4682B4'
}

const typeAmount = (activity: any) => ({
    Tips: `${activity.currency}`,
    Subscriptions: ' Month' + (activity.amount > 1 ? 's' : ''),
    Subgifts: 'x',
    Cheers: ' Bits',
    Followers: '', // does not have an amount field
    Hosts: ' Viewer',
    Raids: ' Viewer'
});

const formatTier = (tier: string) => {
    switch (tier) {
        case '1000': return 'Tier 1';
        case '2000': return 'Tier 2';
        case '3000': return 'Tier 3';
        case 'prime': return 'Prime';
        default: return 'N/A';
    }
};

const Activity = ({ activity, index, channelId }: ActivityProp) => {
    /**
     * activity formatting
     */
    const svg: string = typeSvg[activity.activity.sortingActivityName as keyof typeof typeSvg];
    const color: string = typeColor[activity.activity.sortingActivityName as keyof typeof typeColor];
    const amount: string = typeAmount(activity)[activity.activity.sortingActivityName as keyof typeof typeAmount];

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: currency, minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 }).format(amount);
    };

    /**
     * handle clicking on links because of electron
     * @param url 
     */
    const handleLinkClick = (url: string) => {
        if (typeof window !== 'undefined' && (window as any).api && (window as any).api.openLink) {
            (window as any).api.openLink(url);
        } else {
            window.open(url, '_blank');
        }
    };

    /**
     * updating time every 1s
     */
    const [now, setNow] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const calculateTimeDifference = () => {
        const createdDate = new Date(activity.activity.createdAt);
        const diffInSeconds: number = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} s`;
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)} m`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)} h`;
        } else {
            return `${Math.floor(diffInSeconds / 86400)} d`;
        }
    };

    /**
     * manage hovering above the time
     */
    const [isHovering, setHovering] = useState(false);

    /**
     * replaying activity
     */
    const replayActivity = () => {
        const toastId = toast.loading('Replaying activity...', {
            style: {
                background: 'black',
                borderWidth: '0.5px',
                borderColor: 'gray',
                color: 'white'
            },
            duration: 3 * 1000
        });

        fetch(API_URL.replace('{0}', channelId).replace('{1}', activity.activity.id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);

            toast.success('Replayed activity', {
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

            toast.warning('Could not replay activity', {
                id: toastId,
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

    return (
        <>

            <div
                className='ml-[5px] mt-1 mr-1.5 p-5 border border-color_gray rounded-lg px-3 py-2'
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                <div className='flex gap-3 items-center'>
                    <div dangerouslySetInnerHTML={{ __html: svg || '' }} />
                    <p style={{ color: color }} className='font-bold'>
                        {activity.gifted ? (
                            activity.sender.username
                        ) : (
                            activity.user.username
                        )}
                    </p>

                    {activity.amount ? (
                        <div className='bg-[#1F2937] px-3 inline-block rounded-full text-center'>
                            <p className='text-white'>
                                {activity.activity.sortingActivityName === 'Tips' ? (
                                    formatCurrency(activity.amount, activity.currency)
                                ) : (
                                    activity.amount + amount
                                )}
                            </p>
                        </div>
                    ) : null}

                    {activity.tier ? (
                        <div className='bg-[#1F2937] px-3 inline-block rounded-full text-center'>
                            <p className='text-white'>
                                {formatTier(activity.tier)}
                            </p>
                        </div>
                    ) : null}
                </div>

                {activity.message ? (
                    <div style={{ userSelect: 'text' }} className='overflow-hidden'>
                        <Linkify componentDecorator={(decoratedHref: any, decoratedText: any, key: any) => (
                            <a rel='noreferrer' target="_blank" onClick={() => handleLinkClick(decoratedHref)} key={key} className="color_purple hover:cursor-pointer">
                                {decoratedText}
                            </a>
                        )}>
                            <p className='text-gray-200'>{activity.message}</p>
                        </Linkify>
                    </div>
                ) : null}

                <div className='absolute right-6 top-1/2 transform -translate-y-1/2'>
                    {isHovering ? (
                        <Button onClick={replayActivity}>
                            <svg width="14px" height="14px" viewBox="-1.5 0 19 19">
                                <g fill="none" fillRule="evenodd">
                                    <path d="M8 4a7 7 0 1 1-7 7" stroke="#DADBDD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="m6.826 7.886-5.13-3.581c-.216-.126-.26-.365-.098-.534a.5.5 0 0 1 .098-.076l5.13-3.58c.324-.19.784-.139 1.027.114A.5.5 0 0 1 8 .571v6.858C8 7.744 7.672 8 7.266 8a.9.9 0 0 1-.44-.114" fill="#DADBDD" />
                                </g>
                            </svg>
                        </Button>
                    ) : (
                        <p className='text-gray-400'>{calculateTimeDifference()}</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Activity;
