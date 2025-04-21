const { MongoClient } = require('mongodb');

// Backend function for adding an event to MongoDB
exports.handler = async function(event, context) {
  let client;

  try {
    // Check for environment variable
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not set in Netlify environment variables.");
    }

    // Parse the request body
    const body = JSON.parse(event.body || '{}');
    const { title, start, end, category } = body;

    // Log the request body for debugging
    console.log('Received body:', body);

    // Validate the required fields
    if (!title || !start || !end || !category) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields: title, start, end, category.' })
      };
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();

    const db = client.db("mycalendaruser");  // Use the correct DB name
    const collection = db.collection("events");

    // Insert the event into the database
    const result = await collection.insertOne({ title, start, end, category });

    // Return the full event data including the MongoDB generated ID
    const newEvent = { id: result.insertedId, title, start, end, category };

    return {
      statusCode: 200,
      body: JSON.stringify(newEvent)  // Send the full event data back
    };

  } catch (error) {
    // Log the error for debugging
    console.error('Error in addEvent function:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add event', error: error.message })
    };

  } finally {
    // Safely close the MongoDB connection
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.error('Error closing MongoDB client:', closeError);
      }
    }
  }
};
