"use client"

import { useState } from "react";
import Login from "./sites/login";
import Panel from "./sites/panel";
import { FloatingInput, FloatingLabel } from "@/components/ui/floating_label_input";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
  }

  return (
    <>
    {!isLoggedIn ? (
      <Login onLogin={handleLogin} />
    ) : (
      <Panel />
    )}
    </>
  );
}
