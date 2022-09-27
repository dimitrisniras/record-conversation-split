/**
nexmo context: 
you can find this as the second parameter of rtcEvent funciton or as part or the request in req.nexmo in every request received by the handler 
you specify in the route function.

it contains the following: 
const {
        generateBEToken,
        generateUserToken,
        logger,
        csClient,
        storageClient
} = nexmo;

- generateBEToken, generateUserToken,// those methods can generate a valid token for application
- csClient: this is just a wrapper on https://github.com/axios/axios who is already authenticated as a nexmo application and 
    is gonna already log any request/response you do on conversation api. 
    Here is the api spec: https://jurgob.github.io/conversation-service-docs/#/openapiuiv3
- logger: this is an integrated logger, basically a bunyan instance
- storageClient: this is a simple key/value inmemory-storage client based on redis

*/

/**
 *
 * This function is meant to handle all the asyncronus event you are gonna receive from conversation api
 *
 * it has 2 parameters, event and nexmo context
 * @param {object} event - this is a conversation api event. Find the list of the event here: https://jurgob.github.io/conversation-service-docs/#/customv3
 * @param {object} nexmo - see the context section above
 */

const path = require("path");
const DATACENTER = `https://api.nexmo.com`;
let conversation_name;
let record_id;
let recording_enabled = false;

const voiceEvent = async (req, res, next) => {
  const { logger } = req.nexmo;
  try {
    logger.info("Voice event", { event: req.body });
    res.json({});
  } catch (err) {
    logger.error("Error on voiceEvent function");
  }
};

const voiceAnswer = async (req, res, next) => {
  const { logger, csClient } = req.nexmo;
  logger.info("req", { req_body: req.body });

  if (!conversation_name) {
    const convRes = await csClient({
      url: `${DATACENTER}/v0.3/conversations`,
      method: "post",
      data: {},
    });

    conversation_name = convRes.data.name;
  }

  try {
    return res.json([
      {
        action: "talk",
        text: "You are being transferred to a conversation"
      },
      {
        action: "conversation",
        name: conversation_name,
      },
    ]);
  } catch (err) {
    logger.error("Error on voiceAnswer function");
  }
};

const rtcEvent = async (event, { logger, csClient, storageClient }) => {
  try {
    const type = event.type;
    if (type == "rtc:transfer" && !recording_enabled) {
      const { conversation_id } = event;
      let recordRes = await csClient({
        url: `${DATACENTER}/v0.3/conversations/${conversation_id}/events`,
        method: "post",
        data: {
          type: "audio:record",
          from: conversation_id,
          body: {
            validity: 1,
            streamed: true,
            format: "mp3",
            beep_start: true,
            beep_stop: true,
            detect_speech: false,
            split: true,
            channels: 2,
          },
        },
      });
      record_id = recordRes.data.body.recording_id;
      recording_enabled = true;
      //audio:dtmf
    } else if (type == "audio:dtmf" && event.body && event.body.digit == "5") {
      /* the digit 5 was pressed */
      const { conversation_id } = event;
      if (record_id) {
        await csClient({
          url: `${DATACENTER}/v0.3/conversations/${conversation_id}/events`,
          method: "post",
          data: {
            type: "audio:record:stop",
            from: conversation_id,
            body: {
              record_id,
            },
          },
        });
      }
    } else if (type == "audio:record:done") {
      const recordingsString = await storageClient.get("recordings");
      const recordings = recordingsString ? JSON.parse(recordingsString) : [];
      recordings.push(event);
      await storageClient.set("recordings", JSON.stringify(recordings));
    }
  } catch (err) {
    logger.error("Error on rtcEvent function");
  }
};

const route = (app, express) => {
  app.use(express.static(path.join(__dirname, "build")));

  app.get("/recordingEvents", async (req, res) => {
    const { logger, storageClient } = req.nexmo;
    const recordingsString = await storageClient.get("recordings");
    const recordings = recordingsString ? JSON.parse(recordingsString) : [];

    logger.info(`Hello Request HTTP `);

    res.json({
      recordings,
    });
  });

  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
};

module.exports = {
  route,
  rtcEvent,
  voiceEvent,
  voiceAnswer,
};
