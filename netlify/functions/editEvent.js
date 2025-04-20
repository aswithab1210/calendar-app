const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
  const body = JSON.parse(event.body);
  const { id, title, start, end, category } = body;
  
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db("calendarDB");
    const collection = db.collection("events");

    // Find and update the event based on its ID
    const result = await collection.updateOne(
      { _id: new MongoClient.ObjectID(id) }, // Find the event by ID
      {
        $set: { 
          title, 
          start, 
          end, 
          category 
        }
      }
    );

    // If no document was updated, return an error
    if (result.matchedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Event not found' })
      };
    }

    // Return the updated event
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event updated successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to edit event' })
    };
  } finally {
    client.close();
  }
};
