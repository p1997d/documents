import firebase from 'firebase/app';
import 'firebase/database';

if ( !firebase.apps.length ) {
  const firebaseConfig = {
    apiKey: 			process.env.Firebase_apiKey,
    authDomain:			"documents-58867.firebaseapp.com",
    databaseURL:		"https://documents-58867-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: 			"documents-58867",
    storageBucket: 		"documents-58867.appspot.com",
    messagingSenderId:	"632180671538",
    appId: 				"1:632180671538:web:409c8afca57c102cc2e82b"
  };
  firebase.initializeApp(firebaseConfig);
  firebase.database();
}
const fireDb = firebase.database();
export { fireDb };
