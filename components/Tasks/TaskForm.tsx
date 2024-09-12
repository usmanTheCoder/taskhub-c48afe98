'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { trpc } from '@/lib/trpc';
import { addTask, updateTask } from '@/store/slices/taskSlice';
import { RootState } from '@/store';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import ErrorAlert from '@/components/UI/ErrorAlert';
import { FaPlus } from 'react-icons/fa';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const TaskForm = ({ defaultValues, onClose }: { defaultValues?: FormData; onClose: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const taskState = useSelector((state: RootState) => state.task);

  const { mutateAsync: createTaskMutation } = trpc.task.create.useMutation();
  const { mutateAsync: updateTaskMutation } = trpc.task.update.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (defaultValues) {
        await updateTaskMutation({ id: defaultValues.id, ...data });
        dispatch(updateTask({ id: defaultValues.id, ...data }));
      } else {
        const newTask = await createTaskMutation(data);
        dispatch(addTask(newTask));
      }
      onClose();
    } catch (err) {
      setError('An error occurred while processing your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <ErrorAlert message={error} />}
      <Input
        label="Title"
        id="title"
        error={errors.title?.message}
        {...register('title')}
      />
      <Input
        label="Description"
        id="description"
        error={errors.description?.message}
        {...register('description')}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          icon={<FaPlus />}
          loadingText={defaultValues ? 'Updating...' : 'Creating...'}
        >
          {defaultValues ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;