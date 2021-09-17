import React, { useEffect, useState } from "react"
import { getDocs, collection, query, where } from "firebase/firestore"
import SeasonTable from "../Components/SeasonTable"
import { fbRaces } from "../services/fb-collection"

const PreviousSeasons = ({ db }) => {
  const [previousSeasonsList, setPreviousSeasonsList] = useState([])

  const fetchPreviousSeasons = async () => {
    const previousSeasonsSnapshot = []
    const seasonsRef = collection(db, fbRaces)
    const seasonsQuery = query(seasonsRef, where("complete", "==", true))
    const querySeasonsSnapshot = await getDocs(seasonsQuery)
    querySeasonsSnapshot.forEach(doc => {
      previousSeasonsSnapshot.push({
        ...doc.data(),
        infoOpen: false,
        timestamp: new Intl.DateTimeFormat("en-GB", {
          dateStyle: "full",
          timeStyle: "short",
        }).format(doc.data().timestamp.toDate()),
      })
      console.log(doc.data())
    })
    setPreviousSeasonsList(
      previousSeasonsSnapshot.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      )
    )
  }

  const handleInfoOpen = previousSeasonIndex => {
    const updateSeasonsList = previousSeasonsList.map((season, seasonIndex) =>
      seasonIndex === previousSeasonIndex
        ? {
            ...season,
            infoOpen: !season.infoOpen,
          }
        : { ...season }
    )
    setPreviousSeasonsList(updateSeasonsList)
  }

  useEffect(() => {
    fetchPreviousSeasons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {!previousSeasonsList.length && <div>There are no Previous Seasons!</div>}
      <div className="bg-white">
        {previousSeasonsList.map((previousSeason, previousSeasonIndex) => {
          return (
            <div
              className="border-2 border-black p-2"
              key={`previous-season-${previousSeasonIndex}`}
            >
              <div className="col-span-5 self-center">
                <div
                  className="text-sm sm:text-base cursor-pointer text-red-500 font-bold hover:text-black"
                  onClick={() => handleInfoOpen(previousSeasonIndex)}
                >
                  {previousSeason.timestamp}
                </div>
                {previousSeason.infoOpen && (
                  <SeasonTable gameState={previousSeason} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PreviousSeasons
