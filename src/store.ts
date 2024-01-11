/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { type UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { ITEM_TYPE } from './constants';
import { createSelectors } from './createSelectors';

enableMapSet();

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
    columns: Map<UniqueIdentifier, Column>;
    columnOrder: UniqueIdentifier[];
    tasks: Map<UniqueIdentifier, Task>;
    activeColumnId: UniqueIdentifier | null;
    activeTaskId: UniqueIdentifier | null;
};

export type Actions = {
    addTask: (task: Task) => void;
    deleteTask: (taskId: UniqueIdentifier, columnId: UniqueIdentifier) => void;
    addColumn: (column: Column) => void;
    moveColumn: (
        activeColumnId: UniqueIdentifier,
        overColumnId: UniqueIdentifier,
    ) => void;
    moveTask: (
        activeTaskId: UniqueIdentifier,
        overId: UniqueIdentifier,
        overType: (typeof ITEM_TYPE)[keyof typeof ITEM_TYPE],
    ) => void;
    deleteColumn: (columnId: UniqueIdentifier) => void;
    setActiveColumnId: (columnId: UniqueIdentifier | null) => void;
    setActiveTaskId: (taskId: UniqueIdentifier | null) => void;
};

type BoardState = Actions & Board;

export const useBoardStoreBase = create<BoardState>()(
    immer<BoardState>((set) => ({
        // state
        columnOrder: [],
        columns: new Map<UniqueIdentifier, Column>(),
        tasks: new Map<UniqueIdentifier, Task>(),
        activeColumnId: null,
        activeTaskId: null,

        // functions
        addTask: (task) => {
            set((state) => {
                const column = state.columns.get(task.columnId);

                if (column) {
                    state.tasks.set(task.id, task);
                    column.taskIds.push(task.id);
                }
            });
        },

        deleteTask: (taskId, columnId) => {
            set((state) => {
                const column = state.columns.get(columnId);
                if (column) {
                    column.taskIds = column.taskIds.filter((d) => d !== taskId);
                    state.tasks.delete(taskId);
                }
            });
        },

        moveTask: (activeTaskId, overId, overType) => {
            set((state) => {
                const activeTask = state.tasks.get(activeTaskId);
                if (!activeTask) return;

                const activeTaskColumnId = activeTask.columnId;
                const activeTaskColumn = state.columns.get(activeTaskColumnId);

                if (!activeTaskColumn) {
                    console.error(
                        `Active Task Column: ${activeTaskColumnId} not found`,
                    );
                    return;
                }

                const activeTaskIndex = activeTaskColumn.taskIds.findIndex(
                    (d) => d === activeTaskId,
                );

                if (overType === ITEM_TYPE.COLUMN) {
                    const overColumn = state.columns.get(overId);
                    if (!overColumn) return;

                    // move task to an empty column
                    if (activeTaskColumnId !== overId) {
                        // remove task ID from the previous column
                        activeTaskColumn.taskIds.splice(activeTaskIndex, 1);
                        // update column ID in the task
                        activeTask.columnId = overId;
                        // add task ID to the new column
                        overColumn.taskIds.splice(0, 0, activeTaskId);
                    }
                }

                if (overType === ITEM_TYPE.TASK) {
                    const overTask = state.tasks.get(overId);

                    if (!overTask) return;

                    const overTaskColumnId = overTask.columnId;
                    const overTaskColumn = state.columns.get(overTaskColumnId);

                    if (!overTaskColumn) {
                        console.error(
                            `Over Task Column: ${overTaskColumnId} not found`,
                        );
                        return;
                    }

                    const overTaskIndex = overTaskColumn.taskIds.findIndex(
                        (d) => d === overId,
                    );

                    // move task in same column
                    if (activeTaskColumnId === overTaskColumnId) {
                        overTaskColumn.taskIds = arrayMove(
                            overTaskColumn.taskIds,
                            activeTaskIndex,
                            overTaskIndex,
                        );
                    }

                    // move task to other column
                    if (activeTaskColumnId !== overTaskColumnId) {
                        // remove task ID from the previous column
                        activeTaskColumn.taskIds.splice(activeTaskIndex, 1);
                        // update column ID in the task
                        activeTask.columnId = overTaskColumnId;
                        // add task ID to the new column
                        overTaskColumn.taskIds.splice(
                            overTaskIndex,
                            0,
                            activeTaskId,
                        );
                    }
                }
            });
        },

        setActiveTaskId(id) {
            set((state) => {
                state.activeTaskId = id;
            });
        },

        addColumn: (column) => {
            set((state) => {
                state.columnOrder.push(column.id);
                state.columns.set(column.id, column);
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
            });
        },
        deleteColumn(columnId) {
            set((state) => {
                // delete column id from column order array
                state.columnOrder = state.columnOrder.filter(
                    (d) => d !== columnId,
                );

                // delete task in the column from the task Map
                state.columns.get(columnId)?.taskIds.map((taskId) => {
                    state.tasks.delete(taskId);
                });

                // delete column from the column Map
                state.columns.delete(columnId);
            });
        },
        setActiveColumnId(id) {
            set((state) => {
                state.activeColumnId = id;
            });
        },
    })),
);

export const useBoardStore = createSelectors(useBoardStoreBase);
