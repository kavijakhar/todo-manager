import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo, editTodo } from '../redux/todoSlice';
import { toast } from 'react-toastify';

const TodoForm = ({ editingTodo, setEditingTodo, activeTab }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [type, setType] = useState('weekly');
    const dispatch = useDispatch();
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
        setTodos(storedTodos);
    }, []);

    // Pre-fill form fields if editing a todo
    useEffect(() => {
        if (editingTodo) {
            setTitle(editingTodo.title);
            setDate(editingTodo.date);
            setTimeSlot(editingTodo.timeSlot);
            setType(editingTodo.type);
        }
    }, [editingTodo]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        const existingTodo = todos.find(todo =>
            todo.timeSlot === timeSlot &&
            todo.id !== (editingTodo ? editingTodo.id : null)
        );

        if (existingTodo) {
            toast.error('A task with the same time slot already exists.');
        } else if (title && date && timeSlot && type) {
            if (editingTodo) {
                // Dispatch editTodo action
                dispatch(editTodo({
                    id: editingTodo.id,
                    updatedTodo: { title, date, timeSlot, type },
                }));
                setEditingTodo(null); // Reset editing state
                toast.success('Todo updated successfully!');
            } else {
                // Dispatch addTodo action
                dispatch(addTodo({ title, date, timeSlot, type }));
                toast.success('Todo added successfully!');
            }

            // Reset form fields after submission
            setTitle('');
            setDate('');
            setTimeSlot('');
            setType('weekly');

            // Update local storage to include the new todo
            const updatedTodos = JSON.parse(localStorage.getItem('todos')) || [];
            setTodos(updatedTodos);
        }
    }, [dispatch, title, date, timeSlot, type, editingTodo, setEditingTodo, todos]);

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    required
                />
            </div>

            <div>
                <label>Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Time Slot:</label>
                <input
                    type="text"
                    disabled={editingTodo}
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="e.g., 9:00 AM - 10:00 AM"
                    required
                />
            </div>

            <div>
                <label>Type:</label>
                <select
                    value={type}
                    
                    disabled={editingTodo}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>
            {(activeTab !== "completed") && (
                <button type="submit">
                    {editingTodo ? 'Update' : 'Add Task'}
                </button>
            )}
            {(activeTab === "completed" && editingTodo) && (
                <button type="submit">
                    Update
                </button>
            )}
        </form>
    );
};

export default TodoForm;
