import React, { forwardRef } from 'react';

interface ActivityProp {
    activity: any;
    style: React.CSSProperties;
    index: number;
};

const Activity = forwardRef<HTMLDivElement, ActivityProp>(({ activity, style, index }, ref) => {
    return (
        <div ref={ref} style={style}>
            <p className="text-white">{index} : Type is {activity.activity.createdAt}</p>
        </div>
    );
});

export default Activity;