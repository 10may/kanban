import { cn } from '@/lib/utils';
import { useBoardStore } from '@/store';
import { type UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';

import { Button } from './ui/button';
import { Card, CardTitle } from './ui/card';

export type ColumnProps = {
    children: React.ReactNode;
    id: UniqueIdentifier;
};

export const Column: React.FC<ColumnProps> = ({ id, children }) => {
    const column = useBoardStore.use.columns()[id];
    const addTask = useBoardStore.use.addTask();
    const columnOrder = useBoardStore.use.columnOrder();

    const colIndex = columnOrder.findIndex((d) => d === column.id);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={cn(
                'relative flex h-fit max-h-full min-w-80 max-w-[322px] flex-col gap-4 bg-slate-200 pb-2', // p-1 pb-2 pt-4',
                isDragging && 'bg-slate-100 *:invisible',
            )}
        >
            <CardTitle
                {...listeners}
                className='sticky top-0 flex justify-between px-4 pt-4'
            >
                {column.title}
                <Button className='h-[40] p-2'>
                    <Trash2 size={16} />
                </Button>
            </CardTitle>
            <div className='flex flex-col gap-3 overflow-y-auto px-3'>
                {children}
            </div>
            <Button
                variant='default'
                className='mx-3'
                onClick={() => {
                    addTask({
                        id: crypto.randomUUID(),
                        title: `Task ${colIndex + 1}.${
                            column.taskIds.length + 1
                        }`,
                        description: 'Task Description',
                        columnId: column.id,
                    });
                }}
            >
                Add Task
            </Button>
        </Card>
    );
};

export default Column;
