const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await client.connect();
        const database = client.db('khotab_db');
        const collection = database.collection('assignments');
        
        const data = req.body;
        data.submissionDate = new Date(); // إضافة وقت التسجيل

        await collection.insertOne(data);
        res.status(200).json({ message: 'Data saved successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error saving data' });
    } finally {
        await client.close();
    }
};