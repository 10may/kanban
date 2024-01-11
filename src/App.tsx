import { AddColumn } from '@/components/AddColumn';
import {
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    type DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

import Column from './components/Column';
import { Header } from './components/header';
import { Task } from './components/Task';
import { ITEM_TYPE } from './constants';
import { useBoardStore } from './store';

function App() {
    const tasks = useBoardStore.use.tasks();
    const activeTaskId = useBoardStore.use.activeTaskId();

    const columnOrder = useBoardStore.use.columnOrder();

    const columns = useBoardStore.use.columns();
    const activeColumnId = useBoardStore.use.activeColumnId();

    const moveTask = useBoardStore.use.moveTask();
    const setActiveTaskId = useBoardStore.use.setActiveTaskId();

    const moveColumn = useBoardStore.use.moveColumn();
    const setActiveColumnId = useBoardStore.use.setActiveColumnId();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 4 },
        }),
    );

    function handleDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === ITEM_TYPE.COLUMN) {
            setActiveColumnId(event.active.id);
        }

        if (event.active.data.current?.type === ITEM_TYPE.TASK) {
            setActiveTaskId(event.active.id);
        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;

        if (!over?.id) return;

        if (active.data.current?.type !== ITEM_TYPE.TASK) return;

        if (over.data.current?.type === ITEM_TYPE.TASK) {
            moveTask(active.id, over.id, ITEM_TYPE.TASK);
        }

        if (over.data.current?.type === ITEM_TYPE.COLUMN) {
            moveTask(active.id, over.id, ITEM_TYPE.COLUMN);
        }

        return;
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over?.id) return;

        // Column dropped over a column
        if (
            active.data.current?.type === ITEM_TYPE.COLUMN &&
            over.data.current?.type === ITEM_TYPE.COLUMN
        ) {
            if (active.id === over.id) return;
            moveColumn(active.id, over.id);
        }

        setActiveTaskId(null);
        setActiveColumnId(null);
    }

    const activeColumn = activeColumnId && columns.get(activeColumnId);
    const activeTask = activeTaskId && tasks.get(activeTaskId);

    return (
        <div className='flex h-screen flex-col pb-2'>
            <Header />
            <div className='mx-2 mt-8 flex grow gap-4 overflow-x-auto p-6 '>
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={columnOrder}>
                        {columnOrder.map((columnId) => {
                            const column = columns.get(columnId);

                            if (!column) return null;

                            const { id, taskIds } = column;

                            return (
                                <Column key={id} id={id}>
                                    <SortableContext items={taskIds}>
                                        {taskIds.map((taskId) => (
                                            <Task
                                                key={taskId}
                                                taskId={taskId}
                                            />
                                        ))}
                                    </SortableContext>
                                </Column>
                            );
                        })}
                    </SortableContext>

                    <DragOverlay>
                        {activeColumn ? (
                            <Column key={activeColumn.id} id={activeColumn.id}>
                                {activeColumn.taskIds.map((taskId) => (
                                    <Task key={taskId} taskId={taskId} />
                                ))}
                            </Column>
                        ) : null}
                        {activeTask ? (
                            <Task key={activeTaskId} taskId={activeTaskId} />
                        ) : null}
                    </DragOverlay>
                </DndContext>
                <AddColumn key={columnOrder.length} />
            </div>
        </div>
    );
}

export default App;
