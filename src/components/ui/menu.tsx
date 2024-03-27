import { emptyActivities } from '@/app/service/streamelements';
import * as Menubar from '@radix-ui/react-menubar';
import * as Switch from '@radix-ui/react-switch';
import { ChevronRightIcon } from 'lucide-react';

import { toast } from 'sonner';

interface MenuProps {
    setLoggedIn: Function;
    setActivities: Function;
    fetchData: Function;
    setElementMap: Function;
    createElementMap: Function;
    settings: any;
    toggleSetting: Function;
    splitScreenEnabled: boolean;
    setSplitScreenEnabled: Function;
    splitScreenHorizontal: boolean;
    setSplitScreenHorizontal: Function;
    setDialogOpen: Function;
    channelId: string;
}

const Menu: React.FC<MenuProps> = ({ 
    setLoggedIn,
    setActivities,
    fetchData,
    setElementMap,
    createElementMap,
    settings,
    toggleSetting,
    splitScreenEnabled,
    setSplitScreenEnabled,
    splitScreenHorizontal,
    setSplitScreenHorizontal,
    setDialogOpen,
    channelId
}) => {

    return (
        <>
        <Menubar.Root className='flex bg-color_darkblue text-white p-[3px] rounded-md border-color_gray border-2 h-9'>
            <Menubar.Menu>
                <Menubar.Trigger className='py-2 px-3 outline-none select-none font-bold leading-none rounded text-[14px] flex items-center justify-between gap-[2px] data-[highlighted]:bg-[#1F2937] data-[state=open]:bg-[#1F2937]'>Client</Menubar.Trigger>
                <Menubar.Portal>
                    <Menubar.Content 
                        align='start' 
                        sideOffset={5} 
                        alignOffset={-3} 
                        className='mt-2 min-w-[220px] bg-color_darkblue border-color_gray border-2 text-white rounded-md p-[7px]'>
                            <Menubar.Item className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[#1F2937] focus:text-white' onSelect={() => {
                                setDialogOpen(true);
                            }}>Info</Menubar.Item>

                            <Menubar.Item className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[#1F2937] focus:text-white' onSelect={() => {
                                setActivities([]);
                                emptyActivities();
                                setElementMap(createElementMap([], settings, channelId));
                                fetchData();
                            }}>Reload Activities & Overlay</Menubar.Item>

                            <Menubar.Item className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[#1F2937] focus:text-white' onSelect={() => {
                                window.location.reload();
                            }}>Reload App</Menubar.Item>

                            <Menubar.Item className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[#1F2937] focus:text-white' onSelect={() => {
                                console.clear();
                                localStorage.removeItem('token');
                                setLoggedIn(false);

                                toast.success('Logged out', {
                                    style: {
                                        background: 'rgb(1, 31, 16)',
                                        borderWidth: '0.5px',   
                                        borderColor: 'rgb(2, 62, 30)',
                                        color: 'rgb(93, 244, 169)'
                                    }
                                });
                            }}>Restart Setup</Menubar.Item>
                    </Menubar.Content>
                </Menubar.Portal>
            </Menubar.Menu>

            <Menubar.Menu>
                <Menubar.Trigger className='py-2 px-3 outline-none select-none font-bold leading-none rounded text-[14px] flex items-center justify-between gap-[2px] data-[highlighted]:bg-[#1F2937] data-[state=open]:bg-[#1F2937]'>View</Menubar.Trigger>
                    <Menubar.Portal>
                        <Menubar.Content
                            align='start' 
                            sideOffset={5} 
                            alignOffset={-3} 
                            className='mt-2 min-w-[220px] bg-color_darkblue border-color_gray border-2 text-white rounded-md p-[7px]'>
                                <Menubar.Sub>
                                    <Menubar.SubTrigger className="flex justify-between relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[#1F2937] focus:text-white">
                                        Split Screen
                                        <ChevronRightIcon />
                                    </Menubar.SubTrigger>

                                    <Menubar.SubContent className='ml-3 py-2 px-3 bg-color_darkblue border-color_gray border-2 rounded grid gap-2'>
                                        <Menubar.Item className='relative text-white flex justify-between gap-5 text-sm items-center focus:bg-[#1F2937] focus:rounded h-9 focus:text-white'>
                                            <div className='flex justify-between gap-5 text-sm items-center'>
                                                <Switch.Root
                                                    className='w-[50px] h-[25px] bg-color_purple rounded-full relative data-[state=checked]:bg-color_purple data-[state=unchecked]:bg-[#202937]'
                                                    onCheckedChange={(checked: boolean) => {
                                                        setSplitScreenEnabled(checked);
                                                    }} 
                                                    onClick={(event: React.MouseEvent) => {
                                                        event.stopPropagation();
                                                    }}
                                                    defaultChecked={splitScreenEnabled}
                                                >
                                                    <Switch.Thumb className='bg-[#030712] block w-[21px] h-[21px] rounded-full will-change-transform transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[27px]' />
                                                </Switch.Root>
                                                <p>Active</p>
                                            </div>
                                        </Menubar.Item>

                                        {splitScreenEnabled && (
                                            <>
                                            <Menubar.Item className='relative text-white flex justify-between gap-5 text-sm items-center focus:bg-[#1F2937] focus:text-white focus:bg-[#1F2937] focus:rounded h-9 focus:text-white'>
                                                <div className='flex justify-between gap-5 text-sm items-center'>
                                                    <Switch.Root
                                                        className='w-[50px] h-[25px] bg-color_purple rounded-full relative data-[state=checked]:bg-color_purple data-[state=unchecked]:bg-[#202937]'
                                                        onCheckedChange={(checked: boolean) => {
                                                            setSplitScreenHorizontal(checked);
                                                        }}
                                                        onClick={(event: React.MouseEvent) => {
                                                            event.stopPropagation();
                                                        }}
                                                        defaultChecked={splitScreenHorizontal}
                                                    >
                                                        <Switch.Thumb className='bg-[#030712] block w-[21px] h-[21px] rounded-full will-change-transform transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[27px]' />
                                                    </Switch.Root>
                                                    Horizontal
                                                </div>
                                            </Menubar.Item>

                                            <Menubar.Sub>
                                                <Menubar.SubTrigger className="flex justify-between relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[#1F2937] focus:text-white">
                                                    {splitScreenHorizontal ? 'Left' : 'Top'} Activities
                                                    <ChevronRightIcon />
                                                </Menubar.SubTrigger>

                                                <Menubar.SubContent className='ml-3 py-2 px-3 bg-color_darkblue border-color_gray border-2 rounded grid gap-2'>
                                                    {Object.keys(settings.a).map((settingKey) => (
                                                        <Menubar.Item key={'a.' + settingKey} className='relative text-white flex justify-between gap-5 text-sm items-center focus:bg-[#1F2937] focus:text-white focus:bg-[#1F2937] focus:rounded h-9 focus:text-white'>
                                                            <div className='flex justify-between gap-5 text-sm items-center'>
                                                                <Switch.Root
                                                                    className='w-[50px] h-[25px] bg-color_purple rounded-full relative data-[state=checked]:bg-color_purple data-[state=unchecked]:bg-[#202937]'
                                                                    onCheckedChange={(checked: boolean) => {
                                                                        toggleSetting('a', settingKey, checked);
                                                                    }}
                                                                    onClick={(event: React.MouseEvent) => {
                                                                        event.stopPropagation();
                                                                    }}
                                                                    defaultChecked={settings.a[settingKey as keyof typeof settings.a]}
                                                                >
                                                                    <Switch.Thumb className='bg-[#030712] block w-[21px] h-[21px] rounded-full will-change-transform transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[27px]' />
                                                                </Switch.Root>
                                                                <p>{settingKey}</p>
                                                            </div>
                                                        </Menubar.Item>
                                                    ))}
                                                </Menubar.SubContent>
                                            </Menubar.Sub>
                                            </>
                                            )}

                                            <Menubar.Sub>
                                                <Menubar.SubTrigger className="flex justify-between relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-[#1F2937] focus:text-white">
                                                    {splitScreenEnabled ? (splitScreenHorizontal ? 'Right' : 'Bottom') : ''} Activities                                                        
                                                    <ChevronRightIcon />
                                                </Menubar.SubTrigger>

                                                <Menubar.SubContent className='ml-3 py-2 px-3 bg-color_darkblue border-color_gray border-2 rounded grid gap-2'>
                                                    {Object.keys(settings.b).map((settingKey) => (
                                                        <Menubar.Item key={'b.' + settingKey} className='relative text-white flex justify-between gap-5 text-sm items-center focus:bg-[#1F2937] focus:text-white focus:bg-[#1F2937] focus:rounded h-9 focus:text-white'>
                                                            <div className='flex justify-between gap-5 text-sm items-center'>
                                                                <Switch.Root
                                                                    className='w-[50px] h-[25px] bg-color_purple rounded-full relative data-[state=checked]:bg-color_purple data-[state=unchecked]:bg-[#202937]'
                                                                    onCheckedChange={(checked: boolean) => {
                                                                        toggleSetting('b', settingKey, checked);
                                                                    }}
                                                                    onClick={(event: React.MouseEvent) => {
                                                                        event.stopPropagation();
                                                                    }}
                                                                    checked={settings.b[settingKey as keyof typeof settings.b]}
                                                                >
                                                                    <Switch.Thumb className='bg-[#030712] block w-[21px] h-[21px] rounded-full will-change-transform transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[27px]' />
                                                                </Switch.Root>
                                                                <p>{settingKey}</p>
                                                            </div>
                                                        </Menubar.Item>
                                                    ))}
                                                </Menubar.SubContent>
                                            </Menubar.Sub>
                                    </Menubar.SubContent>
                                </Menubar.Sub>
                        </Menubar.Content>
                 </Menubar.Portal>
            </Menubar.Menu>
        </Menubar.Root>
        </>
    )
}

export default Menu;