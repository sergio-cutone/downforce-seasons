import React, { useEffect, useState } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom"
import "./App.css"
import Main from "./Components/Main"
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import firestore from "./Services/firestore"
import OpenSeasons from "./Pages/OpenSeasons"
import PreviousSeasons from "./Pages/PreviousSeasons"
import Tracks from "./Pages/Tracks"
import Drivers from "./Pages/Drivers"
import NewSeason from "./Pages/NewSeason"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth"

var db = firestore.firestore()
db.settings({
  timestampsInSnapshots: true,
})

const fbCollection = require("./Services/fb-collection")

function App() {
  // const [isUserLogin, setIsUserLogin] = useState(false)
  // const [email, setEmail] = useState()
  // const [password, setPassword] = useState()

  // const auth = getAuth()
  // setPersistence(auth, browserSessionPersistence)
  //   .then(() => {
  //     // Existing and future Auth states are now persisted in the current
  //     // session only. Closing the window would clear any existing state even
  //     // if a user forgets to sign out.
  //     // ...
  //     // New sign-in will be persisted with session persistence.
  //     return signInWithEmailAndPassword(auth, email, password)
  //   })
  //   .catch(error => {
  //     // Handle Errors here.
  //     const errorCode = error.code
  //     const errorMessage = error.message
  //   })

  // useEffect(() => {
  //   if (isUserLogin) {
  //     const auth = getAuth()
  //     setPersistence(auth, browserSessionPersistence)
  //       .then(() => {
  //         // Existing and future Auth states are now persisted in the current
  //         // session only. Closing the window would clear any existing state even
  //         // if a user forgets to sign out.
  //         // ...
  //         // New sign-in will be persisted with session persistence.
  //         return signInWithEmailAndPassword(auth, email, password)
  //       })
  //       .catch(error => {
  //         // Handle Errors here.
  //         const errorCode = error.code
  //         const errorMessage = error.message
  //       })
  //   }
  // }, [isUserLogin])

  // const googleLogin = () => {
  //   const provider = new GoogleAuthProvider()
  //   const auth = getAuth()

  //   signInWithPopup(auth, provider)
  //     .then(result => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential = GoogleAuthProvider.credentialFromResult(result)
  //       const token = credential.accessToken
  //       // The signed-in user info.
  //       const user = result.user
  //       // ...
  //       setIsUserLogin(result.user.emailVerified)
  //     })
  //     .catch(error => {
  //       // Handle Errors here.
  //       const errorCode = error.code
  //       const errorMessage = error.message
  //       // The email of the user's account used.
  //       const email = error.email
  //       // The AuthCredential type that was used.
  //       const credential = GoogleAuthProvider.credentialFromError(error)
  //       // ...
  //     })
  // }

  return (
    <Router basename="/downforce">
      <div className="App p-5 max-w-screen-md mx-auto">
        <Header />
        <Switch>
          <Route exact path="/">
            {/* {!isUserLogin && <button onClick={googleLogin}>Google</button>} */}
            <h1 className="font-bold text-2xl block mb-3">Last Race Results</h1>
            <Main db={db} fbCollection={fbCollection} />
          </Route>
          <Route exact path="/new-season">
            <h1 className="font-bold text-2xl block mb-3">New Season</h1>
            <NewSeason db={db} fbCollection={fbCollection} />
          </Route>
          <Route exact path="/previous-seasons">
            <h1 className="font-bold text-2xl block mb-3">Previous Seasons</h1>
            <PreviousSeasons db={db} fbCollection={fbCollection} />
          </Route>
          <Route exact path="/open-seasons">
            <h1 className="font-bold text-2xl block mb-3">Open Seasons</h1>
            <OpenSeasons db={db} />
          </Route>
          <Route exact path="/drivers">
            <h1 className="font-bold text-2xl block mb-3">Drivers</h1>
            <Drivers db={db} />
          </Route>
          <Route exact path="/tracks">
            <h1 className="font-bold text-2xl block mb-3">Tracks</h1>
            <Tracks db={db} fbCollection={fbCollection} />
          </Route>
        </Switch>
      </div>
      <Footer />
    </Router>
  )
}

export default App
