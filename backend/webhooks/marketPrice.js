import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
  const crop = req.body.queryResult.parameters.crop;
  const location = req.body.queryResult.parameters.location;

  if (!crop || !location) {
    return res.json({
      fulfillmentText: 'Please specify both crop and market location.',
    });
  }

  try {
    const response = await axios.get('http://127.0.0.1:5000/request', {
      params: {
        commodity: crop,
        state: 'Karnataka', // Replace with dynamic state extraction if available
        market: location,
      },
    });

    const data = response.data;

    if (data && data.length > 0) {
      const latest = data[0];
      const price = latest['Model Prize'];
      const date = latest['Date'];

      return res.json({
        fulfillmentText: `The market price of ${crop} in ${location} is ₹${price} per quintal as of ${date}.`,
      });
    } else {
      return res.json({
        fulfillmentText: `Sorry, I couldn't find the market price of ${crop} in ${location}.`,
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.json({
      fulfillmentText: `Sorry, I couldn't fetch the market price of ${crop} in ${location} at the moment.`,
    });
  }
});


