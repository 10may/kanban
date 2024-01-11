import { ITEM_TYPE } from '@/constants';
import { cn } from '@/lib/utils';
import { useBoardStore } from '@/store';
import { type UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';

import { Button } from './ui/button';
import { Card, CardHeader } from './ui/card';

export type TaskProps = {
    taskId: UniqueIdentifier;
};
export const Task: React.FC<TaskProps> = ({ taskId }) => {
    const task = useBoardStore.use.tasks().get(taskId);
    const deleteTask = useBoardStore.use.deleteTask();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: taskId,
        data: {
            type: ITEM_TYPE.TASK,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    if (!task) {
        console.error(`Task: ${taskId} Not Found`);
        return null;
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={cn(isDragging && 'bg-slate-100 *:invisible')}
        >
            <div
                {...listeners}
                className='group flex flex-row items-center justify-between'
            >
                <CardHeader>{task.title}</CardHeader>
                <Button
                    size={'sm'}
                    className='invisible mr-6 group-hover:visible'
                    onClick={() => {
                        deleteTask(taskId, task.columnId);
                    }}
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        </Card>
    );
};
