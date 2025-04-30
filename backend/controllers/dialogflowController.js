// backend/controllers/dialogflowController.js

import { SessionsClient } from '@google-cloud/dialogflow';
import Query from '../models/Query.js';
import { v4 as uuidv4 } from 'uuid';

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const sessionClient = new SessionsClient();

export const handleVoiceQuery = async (req, res) => {
  const { query, sessionId = uuidv4(), languageCode = 'en' } = req.body;

  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode,
      },
    },
  };

  try {
    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;

    await Query.create({
      sessionId,
      question: query,
      intent: result.intent.displayName,
      response: result.fulfillmentText,
    });

    res.json({
      intent: result.intent.displayName,
      response: result.fulfillmentText,
    });
  } catch (error) {
    console.error('Dialogflow error:', error);
    res.status(500).json({ error: 'Dialogflow error' });
  }
};
