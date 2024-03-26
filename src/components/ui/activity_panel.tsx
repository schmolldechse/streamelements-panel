import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Activity from "./activity";
import React, { useEffect, useRef } from "react";

interface ActivityPanelProps {
    activities: any[];
    settings: any;
}

export const ActivityPanel: React.FC<ActivityPanelProps> = ({ activities, settings }: ActivityPanelProps) => {
    /**
     * Virtualized list
     */
    const listRef = useRef<List>(null);
    const rowHeights = useRef<{ [key: number]: number }>({});
 
    const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
        const rowRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (rowRef.current) {
                setRowHeight(index, rowRef.current.clientHeight);
            }
        }, [rowRef]);

        if (activities[index].activity.sortingActivityName === 'undefined') return;

        return (
            <>
            {
                settings[activities[index].activity.sortingActivityName] 
                ? <Activity activity={activities[index]} style={style} index={index} />
                : null
            }
            </>
        );
    };

    function getRowHeight(index: number): number {
        return rowHeights.current[index] + 8 || 80;
    }

    function setRowHeight(index: number, size: number): void {
        if (listRef.current) {
            //listRef.current.resetAfterIndex(0); //huh?
            rowHeights.current = { ...rowHeights.current, [index]: size };
        }
    }

    return (
        <AutoSizer>
            {({ height, width }) => (
                <List
                    ref={listRef}
                    height={height}
                    width={width}
                    itemCount={activities.length}
                    itemSize={getRowHeight}
                    overscanCount={2}
                    className="activitypanel h-auto overflow-y-scroll"
                >
                    {Row}
                </List>
            )}
        </AutoSizer>
    );
};