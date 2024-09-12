'use client';

import { useRef, useState } from 'react';
import { FaCheckCircle, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useTask } from '@/hooks/useTask';
import { TaskData } from '@/types/task';
import Modal from '../UI/Modal';
import TaskForm from './TaskForm';
import Button from '../UI/Button';
import Input from '../UI/Input';

interface TaskItemProps {
  task: TaskData;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { updateTask, deleteTask, completeTask } = useTask();
  const isLoading = useSelector((state: RootState) => state.task.isLoading);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(task.text);
  };

  const handleSaveEdit = async () => {
    if (editedText.trim()) {
      await updateTask({ ...task, text: editedText });
      setIsEditing(false);
    }
  };

  const handleDeleteTask = async () => {
    await deleteTask(task.id);
  };

  const handleCompleteTask = async () => {
    await completeTask(task.id, !task.completed);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(e.target.value);
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-md">
      {isEditing ? (
        <Input
          value={editedText}
          onChange={handleInputChange}
          ref={inputRef}
          autoFocus
          onBlur={handleSaveEdit}
        />
      ) : (
        <p className={`flex-1 text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.text}
        </p>
      )}
      <div className="flex items-center space-x-2">
        <Button onClick={handleCompleteTask} disabled={isLoading}>
          <FaCheckCircle className={`text-lg ${task.completed ? 'text-green-500' : 'text-gray-400'}`} />
        </Button>
        {!isEditing && (
          <Button onClick={handleEditClick} disabled={isLoading}>
            <FaEdit className="text-lg text-blue-500" />
          </Button>
        )}
        {isEditing && (
          <>
            <Button onClick={handleSaveEdit} disabled={isLoading}>
              Save
            </Button>
            <Button onClick={handleCancelEdit} disabled={isLoading}>
              Cancel
            </Button>
          </>
        )}
        <Button onClick={handleDeleteTask} disabled={isLoading}>
          <FaTrashAlt className="text-lg text-red-500" />
        </Button>
      </div>
      {isEditing && (
        <Modal onClose={handleCancelEdit}>
          <TaskForm task={task} onSubmit={handleSaveEdit} />
        </Modal>
      )}
    </div>
  );
};

export default TaskItem;