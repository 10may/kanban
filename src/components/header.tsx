import { Github } from 'lucide-react';

export const Header = () => {
    return (
        <header className='bg-black p-4'>
            <div className='container mx-auto flex items-center justify-between'>
                <h1 className='text-2xl font-bold text-white'>Kanban Board</h1>
                <a
                    href='https://github.com/10may'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-white'
                >
                    <Github />
                </a>
            </div>
        </header>
    );
};
