import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"

const config = require("./fb-config")

firebase.initializeApp(config)

export default firebase
