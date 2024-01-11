import { useBoardStore } from '@/store';
import { type UniqueIdentifier } from '@dnd-kit/core';

import { Card, CardHeader } from './ui/card';

export type TaskProps = {
    id: UniqueIdentifier;
};
export const Task: React.FC<TaskProps> = ({ id }) => {
    const task = useBoardStore.use.tasks()[id];
    return (
        <Card>
            <CardHeader>{task.title}</CardHeader>
        </Card>
    );
};
