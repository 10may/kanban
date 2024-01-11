import { useBoardStore } from '@/store';
import { useRef, useState } from 'react';

import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

export const AddColumn = () => {
    const columnOrder = useBoardStore.use.columnOrder();
    const addColumn = useBoardStore.use.addColumn();

    const [show, setShow] = useState(false);
    const [value, setValue] = useState(`Column ${columnOrder.length + 1}`);

    const inputRef = useRef<HTMLInputElement>(null);

    if (show) {
        return (
            <Card className='mx-1 h-fit max-h-full min-w-80 max-w-[322px] bg-slate-200 p-3 pb-2 pt-4'>
                <Input
                    ref={inputRef}
                    placeholder='Column Name'
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                />
                <Button
                    variant='default'
                    className='mt-3 min-w-full'
                    onClick={() => {
                        addColumn({
                            // id: columnOrder.length + 1,
                            id: crypto.randomUUID(),
                            title: value,
                            taskIds: [],
                        });
                        setShow(false);
                    }}
                >
                    Add Column
                </Button>
            </Card>
        );
    }

    return (
        <Button
            variant='default'
            className='min-w-80 max-w-[322px]'
            onClick={() => {
                setShow(true);
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 0);
            }}
        >
            Add Column
        </Button>
    );
};
