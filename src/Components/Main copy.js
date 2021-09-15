import React, {
  useState,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react"
import Buttons from "./Buttons"
import HowManyRaces from "./HowManyRaces"
import SelectDrivers from "./SelectDrivers"
import FinishingPoints from "./FinishingPoints"
import RaceResults from "./RaceResults"
import gameReducer from "../Reducers/gameReducer"
import getPoints from "../helpers/getPoints"
import SeasonTable from "./SeasonTable"
import { addDoc, collection, updateDoc, doc, getDoc } from "firebase/firestore"
import { BrowserRouter as Router, useLocation } from "react-router-dom"

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

const Main = ({ db, firebaseDoc }) => {
  const [gameState, dispatch] = useReducer(gameReducer, gameObject)
  const [numberOfDrivers, setNumberOfDrivers] = useState([])
  const [isStartRacing, setIsStartRacing] = useState(false)
  const [nextRace, setNextRace] = useState(0)
  const [isSaveRace, setIsSaveRace] = useState(false)
  const screens = useRef(["new", "options", "results", "table"])
  const [screen, setScreen] = useState(screens.current[0])
  const [isGetRacePoints, setIsGetRacePoints] = useState(false)
  const [isSetFinalResults, setIsSetFinalResults] = useState(false)
  const [isUpdateFB, setIsUpdateFB] = useState(false)
  const [openRaceId, setOpenRaceId] = useState(0)

  const useQuery = () => {
    return new URLSearchParams(useLocation().search)
  }
  let query = useQuery()

  useEffect(() => {
    const fetchOpenSeasons = async id => {
      const docRef = doc(db, "races", id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        dispatch({
          type: "OPEN_SEASON",
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
      return count === gameState.raceScoring.length ? true : false
    }

    const tieOptions = () => {
      return gameState.raceTie > 0 ? true : false
    }

    if (
      !playerNames() ||
      !howManyRaces() ||
      !finishingPoints() ||
      !tieOptions()
    ) {
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
    console.log("start", gameState)
  }, [gameState, checkUserOptions, checkScoreInput, screen, screens])

  useEffect(() => {
    const updateFB = async () => {
      const docRef = doc(db, "races", gameState.docId)
      await updateDoc(docRef, gameState)
      setIsUpdateFB(false)
    }
    isUpdateFB && updateFB()
  }, [gameState, db, isUpdateFB])

  const handleSelectPlayer = numberOfDrivers => {
    setNumberOfDrivers(new Array(numberOfDrivers).fill(0))
    dispatch({ type: "DRIVERS", payload: numberOfDrivers })
    setScreen(screens.current[1])
  }

  const handleEnterPlayerNames = (playerName, index) => {
    const { name, value: newValue, type } = playerName.target
    dispatch({
      type: "DRIVER_NAME",
      payload: { name: newValue, index: index },
    })
  }

  const handleSelectHowManyRaces = selectedNumberOfRaces => {
    dispatch({
      type: "NUMBER_OF_RACES",
      payload: selectedNumberOfRaces.target.value,
    })
  }

  const handleSetFinishingPoints = (racePoints, index) => {
    const { name, value: newValue, type } = racePoints.target
    const value = type === "number" ? +newValue : newValue
    dispatch({
      type: "RACE_SCORING",
      payload: { racePoints: value, index: index },
    })
  }

  const handleSetRaceTie = raceTie => {
    dispatch({
      type: "RACE_TIE",
      payload: raceTie.target.value,
    })
  }

  const handleRaceResults = (money, index) => {
    setIsSetFinalResults(false)
    dispatch({
      type: "RACE_RESULTS",
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
      type: "TRACK",
      payload: {
        nextRace: nextRace,
        track: track.target.value,
      },
    })
  }

  const handleRacePoints = racePoints => {
    dispatch({
      type: "RACE_POINTS",
      payload: racePoints,
    })
  }

  const handleRaceLog = async () => {
    dispatch({
      type: "RACE_FINISHED",
      payload: {
        earnings: gameState.racePointsBreakdown,
        nextRace: nextRace,
        complete: nextRace + 1 < gameState.season.length ? false : true,
        raceNumber:
          nextRace + 1 < gameState.season.length ? nextRace + 1 : nextRace,
      },
    })
    gameState.racePointsBreakdown = []
    console.log("gameState", nextRace + 1, gameState.season.length)

    nextRace + 1 < gameState.season.length
      ? setNextRace(nextRace + 1)
      : setScreen(screens.current[3])

    setIsUpdateFB(true)
  }

  const handleInitialSave = async () => {
    const docRef = await addDoc(collection(db, "races"), gameState)
    await updateDoc(docRef, {
      docId: docRef.id,
    })
    dispatch({
      type: "UPDATE_DOC_ID",
      payload: docRef.id,
    })
  }

  return (
    <Router>
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
            <HowManyRaces handleSelectHowManyRaces={handleSelectHowManyRaces} />
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
    </Router>
  )
}

export default Main
