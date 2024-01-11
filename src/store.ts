/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { type UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSelectors } from './createSelectors';

export type Task = {
    id: UniqueIdentifier;
    title: string;
    description: string;
    dueDate?: Date;
    columnId: UniqueIdentifier;
};

export type Column = {
    id: UniqueIdentifier;
    title: string;
    taskIds: UniqueIdentifier[];
};

export type Board = {
    columns: Record<string, Column>;
    columnOrder: UniqueIdentifier[];
    tasks: Record<string, Task>;
    activeColumnId: UniqueIdentifier | null;
};

export type Actions = {
    addTask: (task: Task) => void;
    addColumn: (column: Column) => void;
    moveColumn: (
        activeColumnId: UniqueIdentifier,
        overColumnId: UniqueIdentifier,
    ) => void;
    deleteColumn: (columnId: UniqueIdentifier) => void;
    setActiveColumnId: (id: UniqueIdentifier | null) => void;
};

/* const initialData: Board = {
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To Do',
            taskIds: ['task-1', 'task-2'],
        },
        'column-2': {
            id: 'column-2',
            title: 'In Progress',
            taskIds: ['task-3'],
        },
        'column-3': { id: 'column-3', title: 'Done', taskIds: ['task-4'] },
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
    tasks: {
        'task-1': {
            id: 'task-1',
            title: 'Task 1',
            description: 'Description 1',
            columnId: 'column-1',
        },
        'task-2': {
            id: 'task-2',
            title: 'Task 2',
            description: 'Description 2',
            columnId: 'column-1',
        },
        'task-3': {
            id: 'task-3',
            title: 'Task 3',
            description: 'Description 3',
            columnId: 'column-2',
        },
        'task-4': {
            id: 'task-4',
            title: 'Task 4',
            description: 'Description 4',
            columnId: 'column-3',
        },
    },
}; */

type BoardState = Actions & Board;

export const useBoardStoreBase = create<BoardState>()(
    immer<BoardState>((set) => ({
        columnOrder: [],
        columns: {},
        tasks: {},
        activeColumnId: null,

        // ...initialData,
        addColumn: (column) => {
            set((state) => {
                state.columnOrder.push(column.id);
                state.columns = {
                    ...state.columns,
                    [column.id]: column,
                };
            });
        },

        moveColumn: (activeColumnId, overColumnId) => {
            set((state) => {
                const activeColumnIndex = state.columnOrder.findIndex(
                    (d) => d === activeColumnId,
                );
                const overColumnIndex = state.columnOrder.findIndex(
                    (d) => d === overColumnId,
                );

                state.columnOrder = arrayMove(
                    state.columnOrder,
                    activeColumnIndex,
                    overColumnIndex,
                );
                state.activeColumnId = null;
            });
        },
        deleteColumn(columnId) {
            set((state) => {
                state.columnOrder = state.columnOrder.filter(
                    (d) => d !== columnId,
                );
                delete state.columns[columnId];
            });
        },
        setActiveColumnId(id) {
            set((state) => {
                state.activeColumnId = id;
            });
        },
        addTask: (task) => {
            set((state) => {
                state.columns[task.columnId].taskIds.push(task.id);
                state.tasks = { ...state.tasks, [task.id]: task };
            });
        },
    })),
);

export const useBoardStore = createSelectors(useBoardStoreBase);
