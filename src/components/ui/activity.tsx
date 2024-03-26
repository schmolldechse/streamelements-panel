import React from 'react';

interface ActivityProp {
    activity: any;
    style: React.CSSProperties;
    index: number;
};

const Activity = ({ activity, style, index }: ActivityProp) => {
    return (
        <div style={style}>
            <p className="text-white">{index} : Type is {activity.activity.createdAt}</p>
        </div>
    );
};

export default Activity;