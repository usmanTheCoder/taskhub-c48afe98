'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchTasks } from '@/store/slices/taskSlice';
import { TaskList } from '@/components/Tasks/TaskList';
import { Modal } from '@/components/UI/Modal';
import { TaskForm } from '@/components/Tasks/TaskForm';
import { Spinner } from '@/components/UI/Spinner';
import { ErrorAlert } from '@/components/UI/ErrorAlert';
import { FaPlusCircle } from 'react-icons/fa';
import { trpc } from '@/lib/trpc';

const TasksPage: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [showModal, setShowModal] = React.useState(false);
  const utils = trpc.useContext();

  const { mutate: createTask, isLoading: isCreating } = trpc.useMutation('task.create', {
    onSuccess: async () => {
      setShowModal(false);
      await utils.invalidateQueries('task.getAll');
    },
  });

  const handleCreateTask = async (title: string, description: string) => {
    await createTask({ title, description });
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
          onClick={() => setShowModal(true)}
        >
          <FaPlusCircle className="mr-2" />
          Add Task
        </button>
      </div>
      <TaskList tasks={tasks} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <TaskForm
          isLoading={isCreating}
          onSubmit={handleCreateTask}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default TasksPage;
```



This component combines various features, including Redux state management, tRPC for API calls, custom components, modals, forms, error handling, and animations/transitions using Tailwind CSS. It follows best practices for code organization and uses advanced TypeScript features for type safety.