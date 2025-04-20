// addEvent.js netlify function

const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
  const body = JSON.parse(event.body);
  const { title, start, end, category } = body;
  
  const client = new MongoClient(process.env.MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db("calendarDB");
    const collection = db.collection("events");
    const result = await collection.insertOne({ title, start, end, category });
    
    return {
      statusCode: 200,
      body: JSON.stringify(result.ops[0])
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add event' })
    };
  } finally {
    client.close();
  }
};
