require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.MONGO_URI);
let db;

client.connect()
    .then(() => {
        db = client.db('todolistDB');
        console.log('Connected to MongoDB');
        app.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB', error);
    });

app.get('/items', async (req, res) => {
    try {
        const items = await db.collection('items').find().toArray();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

app.post('/additem', async (req, res) => {
    const newItem = {
        task: req.body.task,
        completed: false,
        dueDate: req.body.dueDate || null,
    };

    try {
        const result = await db.collection('items').insertOne(newItem);
        res.status(201).json({ message: 'Item added successfully', itemId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
    }
});

app.put('/items/:id', async (req, res) => {
    const { id } = req.params;
    const updates = {};

    if (req.body.task !== undefined) {
        updates.task = req.body.task;
    }
    if (req.body.completed !== undefined) {
        updates.completed = req.body.completed;
    }

    try {
        const result = await db.collection('items').updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Item updated successfully' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

app.delete('/items/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.collection('items').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});
