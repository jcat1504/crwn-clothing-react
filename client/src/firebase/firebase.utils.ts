import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { ICollections, ICollection } from '../interfaces/interfaces';

const firebaseConfig = {
    apiKey: "AIzaSyDEgLladDSpN-ciftUPkyASdvc8Hjsx2EI",
    authDomain: "crwn-clothing-react-4d940.firebaseapp.com",
    databaseURL: "https://crwn-clothing-react-4d940.firebaseio.com",
    projectId: "crwn-clothing-react-4d940",
    storageBucket: "crwn-clothing-react-4d940.appspot.com",
    messagingSenderId: "859416991281",
    appId: "1:859416991281:web:d008036b727e90cad32710"
};

firebase.initializeApp(firebaseConfig);

export const createUserProfileDocument = async (userAuth: firebase.User, additionalData?: { displayName: string }) => {
  if(!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const userSnapShot = await userRef.get();

  if(!userSnapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      })
    } catch (e) {
      console.log('error creating user', e.message);
    }
  }

  return userRef;
};

export const getUserCartRef = async (userId: string) => {
  const cartRef = firestore.collection('carts').where('userId', '==', userId);
  const snapShot = await cartRef.get();

  if (snapShot.empty) {
    const cartsDocRef = firestore.collection('carts').doc();
    const userCartDocRef = await cartsDocRef.set({ userId, cartItems: [] });
    return userCartDocRef;
  } else {
    return snapShot.docs[0].ref;
  }
};

export const convertCollectionsSnapshotToMap = (collectionsSnapshot: firebase.firestore.QuerySnapshot) => {
  const transformedCollection = collectionsSnapshot.docs.map(doc => {
    const { title, items } = doc.data();

    const collection: ICollection = {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items
    }

    return collection;
  });

  return transformedCollection.reduce((accumulator: ICollections, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  } , {});
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      unsubscribe();
      resolve(userAuth);
    }, reject);
  });
};

// // For dev purpose
// export const addCollectionAndDocuments = async (collectionKey: string, objectsToAdd: ICollectionItem[]) => {
//   const collectionRef = firestore.collection(collectionKey);

//   const batch = firestore.batch();
//   objectsToAdd.forEach(obj => {
//     const newDocRef = collectionRef.doc();
//     batch.set(newDocRef, obj);
//   });

//   return await batch.commit();
// };

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;
