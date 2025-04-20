const { MongoClient } = require('mongodb'); 
 
exports.handler = async function(event, context) {
  let client;

  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not set in Netlify environment variables.");
    }

    client = new MongoClient(uri);
    await client.connect();

    const db = client.db("calendarDB");
    const collection = db.collection("events");

    const events = await collection.find().toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(events)
    };

  } catch (error) {
    console.error("Error in getEvents function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch events', error: error.message })
    };

  } finally {
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.error("Error closing MongoDB client:", closeError);
      }
    }
  }
};
