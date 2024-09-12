import { useCallback, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useDispatch } from 'react-redux';
import { addTask, updateTask, deleteTask } from '@/store/slices/taskSlice';
import { TaskInput, TaskData } from '@/types';
import { validateTaskInput } from '@/utils/validation';

export const useTask = () => {
  const dispatch = useDispatch();
  const { mutate: createTask, isLoading: isCreatingTask } = trpc.task.create.useMutation();
  const { mutate: updateTaskMutation, isLoading: isUpdatingTask } = trpc.task.update.useMutation();
  const { mutate: deleteTaskMutation, isLoading: isDeletingTask } = trpc.task.delete.useMutation();
  const [error, setError] = useState<string | null>(null);

  const handleCreateTask = useCallback(
    async (input: TaskInput) => {
      try {
        const validationError = validateTaskInput(input);
        if (validationError) {
          setError(validationError);
          return;
        }

        const taskData = await createTask(input);
        dispatch(addTask(taskData));
      } catch (err) {
        console.error('Error creating task:', err);
        setError('Failed to create task. Please try again.');
      }
    },
    [createTask, dispatch],
  );

  const handleUpdateTask = useCallback(
    async (id: string, updatedData: Partial<TaskInput>) => {
      try {
        const validationError = validateTaskInput(updatedData as TaskInput);
        if (validationError) {
          setError(validationError);
          return;
        }

        const updatedTask = await updateTaskMutation({ id, data: updatedData });
        dispatch(updateTask(updatedTask));
      } catch (err) {
        console.error('Error updating task:', err);
        setError('Failed to update task. Please try again.');
      }
    },
    [updateTaskMutation, dispatch],
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      try {
        await deleteTaskMutation({ id });
        dispatch(deleteTask(id));
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task. Please try again.');
      }
    },
    [deleteTaskMutation, dispatch],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    error,
    clearError,
    isCreatingTask,
    isUpdatingTask,
    isDeletingTask,
  };
};