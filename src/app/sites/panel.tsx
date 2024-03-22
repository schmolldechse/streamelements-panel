import { Button } from "@/components/ui/button";
import React from "react";

interface PanelProps {
    channelId: string | undefined;
}

export default function Panel({ channelId }: PanelProps) {
    console.log('got : ' + channelId);

    return (
        <div className="mt-10 p-3">
                <header id='controls'>
                    <Button ></Button>
                    <Button ></Button>
                    <Button ></Button>
                </header>
        </div>
    )
}