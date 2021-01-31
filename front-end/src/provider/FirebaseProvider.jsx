import React, {useState, useEffect} from 'react';
import {fireAuth, fireDB} from '../firebase';

export const firebaseContext = React.createContext()

// #ToDo - Consider adding Sign-In Methods alongside, mostly so that the evaluation of new user is available globally

function FirebaseProvider(props) {
    const [user, setUser] = useState(null);
    const [dataLoad, setDataLoad] = useState({loaded:false, userData:null});
    
    useEffect(()=> {
        fireAuth.onAuthStateChanged((userAuth) => {
        if (userAuth) {
            setUser(userAuth)
            fireDB.collection("usersTwo").doc(userAuth.uid).get()
            .then((doc)=> {
                doc.exists?
                setDataLoad({loaded: true, userData: doc.data()})
                :
            fireDB.collection("businessesTwo").doc(userAuth.uid).get()
                .then((doc)=> {
                    doc.exists?
                    setDataLoad({loaded: true, userData: doc.data()})
                    :
                    console.log("No such document!");
                })
            }).catch((error) => {
                console.error("Error getting document:", error);
            })
        } else {
            setDataLoad({loaded: true, userData: null})
        }
        })
    }, [])

    const processSignOut = () => {
    setDataLoad({...dataLoad, userData: null})
    setUser(null)
    }

    const updateEmailAddress = (email) => {
        fireAuth.currentUser.updateEmail(email).then(function(){
            console.log("Update Successfull");
        }).catch(function(error){
            console.error(error);
        })
    }

    const dataMonitor = (collection,document) => {
        let unsubscribe = fireDB.collection(collection).doc(document).onSnapshot(function(doc){
            setDataLoad({loaded: true, userData: doc.data()})
        })
        unsubscribe()
    }


    return (
        <firebaseContext.Provider value={{user,dataLoad,dataMonitor,processSignOut,updateEmailAddress}}>
            {props.children}
        </firebaseContext.Provider>
    )
}

export default FirebaseProvider