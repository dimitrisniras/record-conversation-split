# record-conversation-split

This React application allows you to make outbound calls using the Vonage Client SDK. During the initial login, you pass a user token and the user is able to perfrom an outbound call based on the provided NCCO.

## Capabilities

Adds Voice capability to your nexmo application and configures the Voice `Answer URL` and `Event URL` webhooks with a connect action on a hardcoded number (`voiceAnswer` and `voiceEvent` in `index.js`).

## To run the server

Pre-requisite: node version >= 14 `nvm use`

`npm run server`

## To run the client

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


## How to use it

You'll have to create at least 3 legs on the conversation (preferrably 2 IP and 1 PSTN leg). You'll have to do 2 outbound calls using the react client above and 1 inbound call on the LVN attached to the application.

The legs will be transferred to the same conversation, a voice will be heared and the recording will start.

The recording is using the split functionality with 2 channels (1 channel will record the initator leg and the other one the rest of them).

The recording can be stopped at any time sending a DTMF (pressing 5) or while iniator leaves the call (that's the split logic).

You can query `localhost:5001/recordingEvents` to get the list of the recording events (and so the url of where to download the recording).
