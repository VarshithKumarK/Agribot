// backend/controllers/audioController.js

import fs from 'fs';
import speech from '@google-cloud/speech';
import { v4 as uuidv4 } from 'uuid';
import Query from '../models/Query.js';
import { SessionsClient } from '@google-cloud/dialogflow';

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const speechClient = new speech.SpeechClient();
const sessionClient = new SessionsClient();

export const transcribeAudioAndQuery = async (req, res) => {
  const audioPath = req.file.path;

  try {
    // Convert file to base64
    const audioBytes = fs.readFileSync(audioPath).toString('base64');

    // Transcribe with Google STT
    const [sttResponse] = await speechClient.recognize({
      audio: { content: audioBytes },
      config: {
        encoding: 'LINEAR16',           // use 'WEBM_OPUS' for webm format
        sampleRateHertz: 44100,
        languageCode: 'en-US',
      },
    });

    const transcript = sttResponse.results.map(r => r.alternatives[0].transcript).join('\n');
    console.log('Transcript:', transcript);

    // Send to Dialogflow
    const sessionId = uuidv4();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const dialogflowRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          text: transcript,
          languageCode: 'en',
        },
      },
    };

    const [dfResponse] = await sessionClient.detectIntent(dialogflowRequest);
    const result = dfResponse.queryResult;

    // Save to MongoDB
    await Query.create({
      sessionId,
      question: transcript,
      intent: result.intent.displayName,
      response: result.fulfillmentText,
    });

    res.json({
      query: transcript,
      intent: result.intent.displayName,
      response: result.fulfillmentText,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing audio.' });
  } finally {
    fs.unlink(audioPath, () => {}); // Clean up the temp audio file
  }
};
