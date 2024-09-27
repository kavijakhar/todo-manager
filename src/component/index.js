import React, { useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const Todos = () => {
    const [editingTodo, setEditingTodo] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="todos-container">
            <div className="sidebar">
                <h3>Tasks</h3>
                <ul className="task-list">
                    <li className="task-item" onClick={() => setActiveTab('all')}>
                        All Tasks
                    </li>
                    <li className="task-item" onClick={() => setActiveTab('completed')}>
                        Completed Tasks
                    </li>
                    <li className="task-item" onClick={() => setActiveTab('deleted')}>
                        Deleted Tasks
                    </li>
                </ul>
            </div>
            <div className="main-content">
                <h2 className="todo-heading">Manage Tasks</h2>
                <div className="container">
                    {(activeTab === 'all' || (activeTab === 'completed' && editingTodo)) && (
                        <TodoForm editingTodo={editingTodo} setEditingTodo={setEditingTodo} activeTab={activeTab} />
                    )}
                    <TodoList setEditingTodo={setEditingTodo} activeTab={activeTab} />
                </div>
            </div>

        </div>
    );
};

export default Todos;
