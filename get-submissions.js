const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const ADMIN_PASSWORD = "Aa112233"; 

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { password } = req.body;

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        await client.connect();
        const database = client.db('khotab_db');
        const collection = database.collection('assignments');

        const submissions = await collection.find({}).sort({ submissionDate: -1 }).toArray();
        
        res.status(200).json(submissions);

    } catch (error) {
        // --- هذا هو الجزء الهام الذي يجب أن يعمل ---
        console.error("A detailed error occurred:", error);
        res.status(500).json({
            message: "An internal server error occurred.",
            error_details: error.toString(), // رسالة الخطأ
            error_stack: error.stack 
        });
        // ------------------------------------------
    } finally {
        if(client) await client.close();
    }
};
