const firebase = require( "firebase");

require("firebase/firestore");
require("firebase/firebase-storage");

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
  };

  firebase.default.initializeApp(firebaseConfig);

  const upload =  async(imageSource,userId) =>{
    const uri = imageSource;
    console.log(uri);
    const childPath = `images/${userId}/${Math.random().toString(36)}`;
    console.log(childPath);
    const response = await fetch(uri);
    // console.log(response);
    const blob = await response.blob();
    // console.log(blob);

    const task = firebase.default.storage().ref().child(childPath).put(blob);

    // console.log(task);
    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };
    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        // savePostData(snapshot);
        console.log(snapshot);
        const downloadableURL = snapshot;
        return downloadableURL;
      });
    };
    const taskError = (snapshot) => {
      const error = `An Error Occured ${snapshot}`;
      console.log(error);
      return(error);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  }

  module.exports.upload =  upload;