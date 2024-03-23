'use client';

import { useState } from 'react';
import Login from './sites/login';
import Panel from './sites/panel';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [channelId, setChannelId] = useState<string | undefined>();
  
  const handleLogin = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
  }

  const setData = (channelId: string | undefined) => {
    setChannelId(channelId);
  };

  return (
    <>
    {!isLoggedIn ? (
      <Login onLogin={handleLogin} setData={setData} />
    ) : (
      <Panel channelId={channelId} />
    )}
    </>
  );
}
