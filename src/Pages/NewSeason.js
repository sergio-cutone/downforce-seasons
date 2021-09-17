import React, {
  useState,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react"
import Buttons from "../Components/Buttons"
import HowManyRaces from "../Components/HowManyRaces"
import SelectDrivers from "../Components/SelectDrivers"
import FinishingPoints from "../Components/FinishingPoints"
import RaceResults from "../Components/RaceResults"
import {
  gameReducer,
  DRIVERS,
  DRIVER_NAME,
  NUMBER_OF_RACES,
  RACE_SCORING,
  RACE_TIE,
  RACE_RESULTS,
  RACE_POINTS,
  RACE_FINISHED,
  UPDATE_DOC_ID,
  TRACK,
  OPEN_SEASON,
} from "../Reducers/gameReducer"
import getPoints from "../helpers/getPoints"
import SeasonTable from "../Components/SeasonTable"
import { addDoc, collection, updateDoc, doc, getDoc } from "firebase/firestore"
import { BrowserRouter as Router, useLocation } from "react-router-dom"
import fetchDrivers from "../helpers/fb-Drivers"
import fetchTracks from "../helpers/fb-Tracks"
import Drivers from "../Pages/Drivers"
import Tracks from "./Tracks"
import { fbRaces } from "../services/fb-collection"

const gameObject = {
  raceScoring: [],
  racePointsBreakdown: [],
  raceNumber: 0,
  raceTie: 0,
  season: [],
  drivers: [],
  complete: false,
  docId: 0,
  timestamp: new Date(),
}

const NewSeason = ({ db, firebaseDoc }) => {
  const [gameState, dispatch] = useReducer(gameReducer, gameObject)
  const [numberOfDrivers, setNumberOfDrivers] = useState([])
  const [isStartRacing, setIsStartRacing] = useState(false)
  const [nextRace, setNextRace] = useState(0)
  const [isSaveRace, setIsSaveRace] = useState(false)
  const screens = useRef(["new", "options", "results", "table", "verify"])
  const [screen, setScreen] = useState(screens.current[0])
  const [isGetRacePoints, setIsGetRacePoints] = useState(false)
  const [isSetFinalResults, setIsSetFinalResults] = useState(false)
  const [isUpdateFB, setIsUpdateFB] = useState(false)
  const [openRaceId, setOpenRaceId] = useState(0)
  const [tracks, setTracks] = useState([])
  const [drivers, setDrivers] = useState([])

  const fetchTracksDrivers = async () => {
    setTracks(await fetchTracks(db))
    setDrivers(await fetchDrivers(db))
  }

  const useQuery = () => {
    return new URLSearchParams(useLocation().search)
  }
  let query = useQuery()

  useEffect(() => {
    const fetchOpenSeasons = async id => {
      const docRef = doc(db, fbRaces, id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        dispatch({
          type: OPEN_SEASON,
          payload: docSnap.data(),
        })
        setScreen(screens.current[2])
        setNextRace(docSnap.data().raceNumber)
      } else {
        console.log("No such document!")
      }
    }

    setOpenRaceId(query.get("id") ? query.get("id") : openRaceId)
    if (query.get("id")) {
      fetchOpenSeasons(query.get("id"))
    }

    fetchTracksDrivers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkUserOptions = useCallback(() => {
    const playerNames = () => {
      let count = 0
      gameState.drivers.map(e => (count = e.name ? count + 1 : count))
      return count === gameState.drivers.length ? true : false
    }

    const howManyRaces = () => {
      return gameState.season.length > 0 ? true : false
    }

    const finishingPoints = () => {
      let count = 0
      gameState.raceScoring.map(e => (count = e !== null ? count + 1 : count))
      return count === gameState.drivers.length ? true : false
    }

    if (!playerNames() || !howManyRaces() || !finishingPoints()) {
      setIsStartRacing(false)
      return false
    }
    setIsStartRacing(true)
  }, [gameState])

  const checkScoreInput = useCallback(
    (verified = gameState.drivers.length ? true : false) => {
      gameState.drivers.forEach(
        driver =>
          (verified =
            driver.races[nextRace].money === null ||
            driver.races[nextRace].track === null
              ? false
              : verified)
      )
      return verified
    },
    [gameState, nextRace]
  )

  const calculateResults = () => {
    const racingResults = gameState.drivers.map(
      driver =>
        driver.races[nextRace].money >= 0 && driver.races[nextRace].money
    )
    handleRacePoints(getPoints(racingResults, gameState.raceScoring))
    setIsSetFinalResults(true)
    setIsGetRacePoints(false)
    setIsSaveRace(true)
  }

  useEffect(() => {
    screen === screens.current[1] && checkUserOptions()
    screen === screens.current[2] && setIsGetRacePoints(checkScoreInput())
  }, [gameState, checkUserOptions, checkScoreInput, screen, screens])

  useEffect(() => {
    const updateFB = async () => {
      const docRef = doc(db, fbRaces, gameState.docId)
      await updateDoc(docRef, gameState)
      setIsUpdateFB(false)
    }
    isUpdateFB && updateFB()
  }, [gameState, db, isUpdateFB])

  const handleSelectPlayer = numberOfDrivers => {
    setNumberOfDrivers(new Array(numberOfDrivers).fill(0))
    dispatch({ type: DRIVERS, payload: numberOfDrivers })
    setScreen(screens.current[1])
  }

  const handleEnterPlayerNames = (playerName, index) => {
    /* eslint-disable-next-line */
    const { name, value: newValue } = playerName.target
    dispatch({
      type: DRIVER_NAME,
      payload: { name: newValue, index: index },
    })
  }

  const handleSelectHowManyRaces = selectedNumberOfRaces => {
    dispatch({
      type: NUMBER_OF_RACES,
      payload: selectedNumberOfRaces.target.value,
    })
  }

  const handleSetFinishingPoints = (racePoints, index) => {
    /* eslint-disable-next-line */
    const { name, value: newValue, type } = racePoints.target
    const value = type === "number" ? +newValue : newValue
    dispatch({
      type: RACE_SCORING,
      payload: { racePoints: value, index: index },
    })
  }

  const handleSetRaceTie = raceTie => {
    dispatch({
      type: RACE_TIE,
      payload: raceTie.target.value,
    })
  }

  const handleRaceResults = (money, index) => {
    setIsSetFinalResults(false)
    dispatch({
      type: RACE_RESULTS,
      payload: {
        money: money.target.value ? money.target.value : "",
        index: index,
        nextRace: nextRace,
      },
    })
    setIsSaveRace(false)
  }

  const handleSetTrack = track => {
    dispatch({
      type: TRACK,
      payload: {
        nextRace: nextRace,
        track: track.target.value,
      },
    })
  }

  const handleRacePoints = racePoints => {
    dispatch({
      type: RACE_POINTS,
      payload: racePoints,
    })
  }

  const handleRaceLog = async () => {
    dispatch({
      type: RACE_FINISHED,
      payload: {
        earnings: gameState.racePointsBreakdown,
        nextRace: nextRace,
        complete: nextRace + 1 < gameState.season.length ? false : true,
        raceNumber:
          nextRace + 1 < gameState.season.length ? nextRace + 1 : nextRace,
      },
    })
    gameState.racePointsBreakdown = []
    nextRace + 1 < gameState.season.length
      ? setNextRace(nextRace + 1)
      : setScreen(screens.current[3])

    setIsUpdateFB(true)
  }

  const handleInitialSave = async () => {
    const docRef = await addDoc(collection(db, fbRaces), gameState)
    await updateDoc(docRef, {
      docId: docRef.id,
    })
    dispatch({
      type: UPDATE_DOC_ID,
      payload: docRef.id,
    })
  }

  return (
    <Router basename="/downforce">
      {!tracks.length && (
        <>
          <div className="p-2 text-white bg-red-800">
            At least 1 Track is required.
          </div>
          <Tracks db={db} addCallBack={fetchTracksDrivers} />
        </>
      )}
      {drivers.length < 2 && (
        <>
          <div className="p-2 text-white bg-red-800">
            At least 2 Drivers are required.
          </div>
          <Drivers db={db} addCallBack={fetchTracksDrivers} />
        </>
      )}
      {tracks.length > 0 && drivers.length > 1 && (
        <div>
          {screen === screens.current[0] && (
            <Buttons handleSelectPlayer={handleSelectPlayer} />
          )}
          {screen === screens.current[1] && (
            <>
              <SelectDrivers
                numberOfDrivers={numberOfDrivers}
                handleEnterPlayerNames={handleEnterPlayerNames}
              />
              <HowManyRaces
                handleSelectHowManyRaces={handleSelectHowManyRaces}
              />
              <FinishingPoints
                numberOfDrivers={gameState.drivers.length}
                handleSetFinishingPoints={handleSetFinishingPoints}
                handleSetRaceTie={handleSetRaceTie}
              />
              {isStartRacing && (
                <div>
                  <button
                    className="button-grey"
                    onClick={() => {
                      handleInitialSave()
                      setScreen(screens.current[2])
                    }}
                  >
                    Start Season
                  </button>
                </div>
              )}
            </>
          )}
          {screen === screens.current[2] && nextRace < gameState.season.length && (
            <>
              <RaceResults
                nextRace={nextRace}
                gameState={gameState}
                handleRaceResults={handleRaceResults}
                handleSetTrack={handleSetTrack}
                isSetFinalResults={isSetFinalResults}
              />
              {isGetRacePoints && (
                <div>
                  <button
                    className="mt-3 button-grey"
                    onClick={() => calculateResults()}
                  >
                    Calculate Results
                  </button>
                </div>
              )}
              {isGetRacePoints && isSaveRace && (
                <button
                  className="mt-3 button-yellow shadow-2xl"
                  onClick={() => {
                    handleRaceLog()
                  }}
                >
                  Save &{" "}
                  {nextRace + 1 === gameState.raceScoring.length
                    ? "End Season"
                    : "Next Race"}
                </button>
              )}
            </>
          )}
          {screen === screens.current[3] && (
            <SeasonTable
              gameState={gameState}
              db={db}
              firebaseDoc={firebaseDoc}
            />
          )}
        </div>
      )}
    </Router>
  )
}

export default NewSeason
