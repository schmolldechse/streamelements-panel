import { AutoSizer, List, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import Activity from "./activity";
import React from "react";
import { MeasuredCellParent } from "react-virtualized/dist/es/CellMeasurer";

interface ActivityPanelProps {
    activities: any[];
    settings: any;
    channelId: string;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ activities, settings, channelId }: ActivityPanelProps) => {
    const cache = new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 80
    });

    const filteredActivities = activities.filter(activity => settings[activity.activity.sortingActivityName]);

    const Row = ({ index, key, style, parent }: { index: number, key: string, style: React.CSSProperties, parent: React.Component }) => {
        const activity = filteredActivities[index];

        if (activity.activity.sortingActivityName === undefined) return;

        return (
            <CellMeasurer
                key={key}
                cache={cache}
                parent={parent as MeasuredCellParent}
                columnIndex={0}
                rowIndex={index}
            >
                {({ measure }) => (
                    <div ref={measure} style={style}>
                        <Activity activity={activity} index={index} channelId={channelId} />
                    </div>
                )}
            </CellMeasurer>
        );
    };

    return (
        <AutoSizer>
            {({ height, width }) => (
                <List
                    height={height}
                    width={width}
                    deferredMeasurementCache={cache}
                    rowHeight={({ index }) => cache.rowHeight({ index })}
                    rowRenderer={Row}
                    rowCount={filteredActivities.length}
                    overscanCount={2}
                    className="activitypanel h-auto overflow-y-scroll"
                />
            )}
        </AutoSizer>
    );
};