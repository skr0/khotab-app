const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// !! يجب أن تكون كلمة المرور هنا مطابقة للكلمة في ملف admin.html !!
const ADMIN_PASSWORD = "Aa112233@"; 

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { password } = req.body;

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Unauthorized' }); // 401 Unauthorized
    }

    try {
        await client.connect();
        const database = client.db('khotab_db');
        const collection = database.collection('assignments');

        // جلب جميع الطلبات وفرزها من الأحدث إلى الأقدم
        const submissions = await collection.find({}).sort({ submissionDate: -1 }).toArray();
        
        res.status(200).json(submissions);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching data' });
    } finally {
        await client.close();
    }
};