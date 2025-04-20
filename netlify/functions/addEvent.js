const { MongoClient } = require('mongodb'); 

exports.handler = async function(event, context) {
  let client;

  try {
    // Check for environment variable
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not set in Netlify environment variables.");
    }

    const body = JSON.parse(event.body || '{}');
    const { title, start, end, category } = body;

    // Validate data
    if (!title || !start || !end || !category) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields: title, start, end, category.' })
      };
    }

    client = new MongoClient(uri);
    await client.connect();

    const db = client.db("calendarDB");
    const collection = db.collection("events");

    const result = await collection.insertOne({ title, start, end, category });

    return {
      statusCode: 200,
      body: JSON.stringify(result.ops ? result.ops[0] : result)  // fallback for different MongoDB driver versions
    };

  } catch (error) {
    console.error("Error in addEvent function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add event', error: error.message })
    };

  } finally {
    // Close MongoDB connection safely
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.error("Error closing MongoDB client:", closeError);
      }
    }
  }
};
