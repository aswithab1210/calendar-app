const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
  const client = new MongoClient(process.env.MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db("calendarDB");
    const collection = db.collection("events");
    const events = await collection.find().toArray();
    
    return {
      statusCode: 200,
      body: JSON.stringify(events)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch events' })
    };
  } finally {
    client.close();
  }
};
