import { AddColumn } from '@/components/AddColumn';
import {
    DndContext,
    type DragEndEvent,
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
import { useBoardStore } from './store';

function App() {
    const columns = useBoardStore.use.columns();
    const moveColumn = useBoardStore.use.moveColumn();
    const columnOrder = useBoardStore.use.columnOrder();
    const activeColumnId = useBoardStore.use.activeColumnId();
    const setActiveColumnId = useBoardStore.use.setActiveColumnId();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 4 },
        }),
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveColumnId(event.active.id);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over?.id) return;
        if (active.id === over.id) return;

        moveColumn(active.id, over.id);
    }

    return (
        <div className='flex h-screen flex-col pb-2'>
            <Header />
            <div className='mx-2 mt-8 flex grow gap-4 overflow-x-auto p-6 '>
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={columnOrder}>
                        {columnOrder.map((columnId) => {
                            const { id, taskIds } = columns[columnId];
                            return (
                                <Column key={id} id={id}>
                                    {taskIds.map((taskId) => (
                                        <Task key={taskId} id={taskId} />
                                    ))}
                                </Column>
                            );
                        })}
                    </SortableContext>
                    <DragOverlay>
                        {activeColumnId ? (
                            <Column
                                key={columns[activeColumnId].id}
                                id={columns[activeColumnId].id}
                            >
                                {columns[activeColumnId].taskIds.map(
                                    (taskId) => (
                                        <Task key={taskId} id={taskId} />
                                    ),
                                )}
                            </Column>
                        ) : null}
                    </DragOverlay>
                </DndContext>
                <AddColumn key={Object.values(columns).length} />
            </div>
        </div>
    );
}

export default App;
