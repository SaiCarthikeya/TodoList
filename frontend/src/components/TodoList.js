import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';
import './styles.css';

const TodoList = () => {
    const [listItems, setListItems] = useState([]);
    const [currentItem, setCurrentItem] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        axios.get("http://localhost:5000/items")
            .then(response => setListItems(response.data))
            .catch(e => console.log("An error occurred", e));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentItem.trim() === '') return;

        try {
            const newItem = { task: currentItem, dueDate: dueDate };
            const response = await axios.post("http://localhost:5000/additem", newItem);
            setListItems([...listItems, { ...newItem, _id: response.data.itemId }]);
            setCurrentItem('');
            setDueDate('');
        } catch (e) {
            console.log("An error occurred", e);
        }
    };
    const handleComplete = (id, completed) => {
        setListItems(prevItems =>
            prevItems.map(item => (item._id === id ? { ...item, completed: completed } : item))
        );
    };

    const handleTaskUpdate = (id, updatedTask) => {
        setListItems(prevItems =>
            prevItems.map(item => (item._id === id ? { ...item, task: updatedTask } : item))
        );
    };

    const handleDelete = (id) => {
        setListItems(prevItems => prevItems.filter(item => item._id !== id));
    };

    return (
        <div className='bg-container'>
            <div className='header'>
                <h1 className='heading'>TODO<span className='green'>LIST</span></h1>
            </div>
            <div className='body-list'>
                <form className='add-item' onSubmit={handleSubmit}>
                    <p className='add-item-text'>Add a new ToDo!!!</p>
                    <div className='flex'>
                        <input
                            type='text'
                            value={currentItem}
                            onChange={(e) => setCurrentItem(e.target.value)}
                            placeholder='Enter your task'
                            required
                        />
                        <input
                            type='date'
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            placeholder='Due date (optional)'
                        />
                        <button type="submit">Add</button>
                    </div>
                </form>
                <ul className='list-items'>
                    {listItems.length <= 0 ? (
                        <p>No tasks to do, you can add a new task!!</p>
                    ) : (
                        listItems.map((eachItem, index) => (
                            <TodoItem
                                key={index}
                                data={eachItem}
                                onTaskUpdate={handleTaskUpdate}
                                onDelete={handleDelete}
                                onComplete={handleComplete}
                            />
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default TodoList;
