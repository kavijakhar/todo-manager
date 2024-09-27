import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaEdit, FaRegCheckCircle } from 'react-icons/fa'; // Edit icon
import { completeTodo, deleteTodo, removeTodoPermanently } from '../redux/todoSlice'; // Import actions
import { FaCircleCheck } from 'react-icons/fa6';
import { MdDeleteOutline } from 'react-icons/md';
import { toast } from 'react-toastify';

const TodoList = ({ setEditingTodo, activeTab }) => {
    const todos = useSelector((state) => state.todos);
    const [selectedTodos, setSelectedTodos] = useState(new Set());
    const [typeFilter, setTypeFilter] = useState('all');
    const dispatch = useDispatch();

    const handleEdit = (todo) => {
        setEditingTodo(todo);
    };

    // Filter todos based on the active tab and type
    const displayTodos = todos.filter(todo => {
        const isActiveTab =
            (activeTab === 'completed' && todo.completed && !todo.deleted) ||
            (activeTab === 'deleted' && todo.deleted) ||
            (activeTab !== 'completed' && activeTab !== 'deleted' && !todo.deleted);

        const isTypeMatch = typeFilter === 'all' || todo.type === typeFilter;

        return isActiveTab && isTypeMatch;
    });

    /*Select Multiple Todos */
    const toggleSelectTodo = (id) => {
        const newSelectedTodos = new Set(selectedTodos);
        if (newSelectedTodos.has(id)) {
            newSelectedTodos.delete(id);
        } else {
            newSelectedTodos.add(id);
        }
        setSelectedTodos(newSelectedTodos);
    };

    /* Mark completed multiple todos*/
    const handleCompleteSelected = () => {
        selectedTodos.forEach(id => {
            const todo = todos.find(todo => todo.id === id);
            if (todo && !todo.completed) {
                dispatch(completeTodo(id));
            }
        });
        setSelectedTodos(new Set());
    };

    /* Delete Multiple todos*/
    const handleDeleteSelected = () => {
        if (selectedTodos.size === 0) return;
        selectedTodos.forEach(id => {
            dispatch(removeTodoPermanently(id));
        });
        toast.success('Selected todos permanently deleted!');
        setSelectedTodos(new Set());
    };


    return (
        <>
            <div className='todo-list'>
                <div>
                    <label htmlFor="typeFilter">Filter by Type:</label>
                    <select
                        id="typeFilter"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                {/* Action Buttons for completing and deleting selected tasks */}
                {selectedTodos.size > 0 && (
                    <div>
                        <span className="action-button" onClick={handleCompleteSelected}>
                            Mark Completed <FaCircleCheck color='green' className="icon" size={18} />
                        </span>

                        <span className="action-button" onClick={handleDeleteSelected}>
                            Delete <MdDeleteOutline size={20} />
                        </span>

                    </div>
                )}
            </div>

            {displayTodos.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'gray', fontSize: '16px' }}>
                    No Tasks found in this category. Please add some tasks to get started!
                </p>
            ) : (
                <ul>
                    {displayTodos.map((todo) => (
                        <li key={todo.id} className="todo-item">
                            <div>
                                {/* Checkbox to select todo */}
                                <input
                                    type="checkbox"
                                    checked={selectedTodos.has(todo.id)}
                                    onChange={() => toggleSelectTodo(todo.id)}
                                    style={{ width: 'auto' }}
                                />
                                <strong>{todo.title}</strong>
                                <span style={{ display: 'block', color: '#777', fontSize: '14px' }}>
                                    {todo.date} - {todo.timeSlot} ({todo.type})
                                </span>
                            </div>
                            <div className="action-buttons">
                                {/* Complete Task Button */}
                                <div className="button" onClick={() => {dispatch(completeTodo(todo.id));toast.success("Todo marked as completed successfully!")}}>
                                    {todo.completed ? <FaCircleCheck color='green' size={20} /> : <FaRegCheckCircle size={20} />}
                                </div>

                                {/* Edit Button */}
                                {activeTab !== 'deleted' && (
                                    <div className="button" onClick={() => handleEdit(todo)}>
                                        <FaEdit size={20} />
                                    </div>
                                )}

                                {/* Delete Task Button */}
                                {activeTab !== 'deleted' && (
                                    <div className="button" onClick={() => { dispatch(deleteTodo(todo.id)); toast.success("Todo Deleted Successfully!") }}>
                                        <MdDeleteOutline size={20} />
                                    </div>
                                )}

                                {/* Permanently Remove Todo Button (only for deleted tasks) */}
                                {activeTab === 'deleted' && (
                                    <div className="button" onClick={() => {
                                        dispatch(removeTodoPermanently(todo.id));
                                        toast.success('Todo permanently deleted!');
                                    }}>
                                        <MdDeleteOutline size={20} />
                                    </div>
                                )}
                            </div>

                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default TodoList;
