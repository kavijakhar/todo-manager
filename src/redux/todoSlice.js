import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('todos')) || [];

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: (state, action) => {
            const newTodo = { id: Date.now(), completed: false, deleted: false, ...action.payload };
            state.push(newTodo);
            localStorage.setItem('todos', JSON.stringify(state));
        },
        editTodo: (state, action) => {
            const { id, updatedTodo } = action.payload;
            const index = state.findIndex(todo => todo.id === id);
            if (index !== -1) {
                state[index] = { ...state[index], ...updatedTodo };
                localStorage.setItem('todos', JSON.stringify(state));
            }
        },
        completeTodo: (state, action) => {
            const todo = state.find(todo => todo.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
                localStorage.setItem('todos', JSON.stringify(state));
            }
        },
        deleteTodo: (state, action) => {
            const todo = state.find(todo => todo.id === action.payload);
            if (todo) {
                todo.deleted = true;
                localStorage.setItem('todos', JSON.stringify(state));
            }
        },
        removeTodoPermanently: (state, action) => {
            const newState = state.filter(todo => todo.id !== action.payload);
            localStorage.setItem('todos', JSON.stringify(newState));
            return newState;
        },

    },
});

export const { addTodo, editTodo, completeTodo, deleteTodo, removeTodoPermanently } = todoSlice.actions;
export default todoSlice.reducer;
