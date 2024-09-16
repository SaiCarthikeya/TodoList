import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';

const TodoItem = ({ data, onTaskUpdate, onDelete, onComplete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [taskName, setTaskName] = useState(data.task);
    const [isCompleted, setIsCompleted] = useState(data.completed); 

    const handleEditClick = async () => {
        if (isEditing) {
            try {
                await axios.put(`http://localhost:5000/items/${data._id}`, { task: taskName });
                onTaskUpdate(data._id, taskName);
            } catch (e) {
                console.log("Error while updating task", e);
            }
        }
        setIsEditing(!isEditing);
    };

    const handleCompleteClick = async () => {
        try {
            await axios.put(`http://localhost:5000/items/${data._id}`, { completed: !isCompleted });
            setIsCompleted(!isCompleted); 
            onComplete(data._id);
        } catch (e) {
            console.log("Error while updating task completion", e);
        }
    };

    const handleDeleteClick = async () => {
        try {
            await axios.delete(`http://localhost:5000/items/${data._id}`);
            onDelete(data._id);
        } catch (e) {
            console.log("Error while deleting task", e);
        }
    };

    const handleChange = (e) => {
        setTaskName(e.target.value);
    };

    return (
        <li className={`list-item ${isCompleted ? 'completed' : ''}`}>
            <input
                type="text"
                value={taskName}
                className="task-name"
                readOnly={!isEditing}
                onChange={handleChange}
            />
            <div className="buttons">
                <button
                        onClick={handleCompleteClick}
                        className={`complete-btn ${isCompleted ? 'completed-btn' : ''}`}
                    >
                    <FontAwesomeIcon icon={faCheck} />
                </button>
                <button onClick={handleEditClick} className="edit-btn">
                    <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
                </button>
                <button onClick={handleDeleteClick} className="delete-btn">
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </li>
    );
};

export default TodoItem;
