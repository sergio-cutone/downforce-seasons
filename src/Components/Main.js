import React, { useState, useEffect } from "react"
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore"
import { BrowserRouter as Router } from "react-router-dom"
import SeasonTable from "./SeasonTable"

const Main = ({ db }) => {
  const [lastRaceList, setLastRaceList] = useState([])

  const fetchLastRace = async () => {
    const openSeasonsSnapshot = []
    const seasonsRef = collection(db, "races")
    const seasonsQuery = query(
      seasonsRef,
      where("complete", "==", true),
      orderBy("timestamp", "desc"),
      limit(1)
    )
    const querySeasonsSnapshot = await getDocs(seasonsQuery)
    querySeasonsSnapshot.forEach(doc => {
      openSeasonsSnapshot.push({
        ...doc.data(),
        timestamp: new Intl.DateTimeFormat("en-GB", {
          dateStyle: "full",
          timeStyle: "short",
        }).format(doc.data().timestamp.toDate()),
      })
    })
    setLastRaceList(openSeasonsSnapshot)
  }

  useEffect(() => {
    fetchLastRace()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Router />
      {!lastRaceList.length && <div>There are no Open Seasons!</div>}
      {lastRaceList.length && (
        <>
          <div className="bg-white">
            {lastRaceList.map((openSeason, openSeasonIndex) => (
              <div
                className="border-2 border-black p-2"
                key={`previous-season-${openSeasonIndex}`}
              >
                <div className="text-xs sm:text-base">
                  <strong>{openSeason.timestamp}</strong>
                </div>
              </div>
            ))}
          </div>
          <SeasonTable gameState={lastRaceList[0]} />
        </>
      )}
    </div>
  )
}

export default Main
