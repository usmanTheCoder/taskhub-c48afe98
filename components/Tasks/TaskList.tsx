'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { fetchTasks } from '@/store/slices/taskSlice';
import TaskItem from './TaskItem';
import { TbCirclePlus } from 'react-icons/tb';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import TaskForm from './TaskForm';
import useAuth from '@/hooks/useAuth';
import Spinner from '../UI/Spinner';
import EmptyState from '../UI/EmptyState';

const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, error } = useSelector((state: RootState) => state.task);
  const { user } = useAuth();
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Task List</h2>
        {user && (
          <Button onClick={() => setShowModal(true)} variant="primary" className="flex items-center">
            <TbCirclePlus className="mr-2" />
            Add Task
          </Button>
        )}
      </div>
      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}
      {showModal && <Modal onClose={() => setShowModal(false)}><TaskForm onSubmit={() => setShowModal(false)} /></Modal>}
    </div>
  );
};

export default TaskList;