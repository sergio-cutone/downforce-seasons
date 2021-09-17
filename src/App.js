import React, { useState } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import "./App.css"
import Main from "./Components/Main"
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import firestore from "./services/firestore"
import OpenSeasons from "./Pages/OpenSeasons"
import PreviousSeasons from "./Pages/PreviousSeasons"
import Tracks from "./Pages/Tracks"
import Drivers from "./Pages/Drivers"
import NewSeason from "./Pages/NewSeason"
import Login from "./Components/Login"

var db = firestore.firestore()
db.settings({
  timestampsInSnapshots: true,
})

const fbCollection = require("./services/fb-collection")

function App() {
  const [isLoggdedIn, setIsLoggedIn] = useState(false)

  return (
    <Router basename="/downforce">
      <div className="App p-5 max-w-screen-md mx-auto">
        <Header />
        {!isLoggdedIn ? (
          <Login setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <Switch>
            <Route exact path="/">
              {/* {!isUserLogin && <button onClick={googleLogin}>Google</button>} */}
              <h1 className="font-bold text-2xl block mb-3">
                Last Season Results
              </h1>
              <Main db={db} fbCollection={fbCollection} />
            </Route>
            <Route exact path="/new-season">
              <h1 className="font-bold text-2xl block mb-3">New Season</h1>
              <NewSeason db={db} fbCollection={fbCollection} />
            </Route>
            <Route exact path="/previous-seasons">
              <h1 className="font-bold text-2xl block mb-3">
                Previous Seasons
              </h1>
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
        )}
      </div>
      <Footer />
    </Router>
  )
}

export default App
