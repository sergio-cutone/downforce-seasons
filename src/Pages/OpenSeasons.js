import React, { useEffect, useState } from "react"
import { getDocs, collection, query, where } from "firebase/firestore"
import { InformationCircleIcon } from "@heroicons/react/solid"
import { BrowserRouter as Router, Link } from "react-router-dom"
import { fbRaces } from "../services/fb-collection"

const OpenSeasons = ({ db }) => {
  const [openSeasonsList, setOpenSeasonsList] = useState([])

  const fetchOpenSeasons = async () => {
    const openSeasonsSnapshot = []
    const seasonsRef = collection(db, fbRaces)
    const seasonsQuery = query(seasonsRef, where("complete", "==", false))
    const querySeasonsSnapshot = await getDocs(seasonsQuery)
    querySeasonsSnapshot.forEach(doc => {
      openSeasonsSnapshot.push({
        ...doc.data(),
        infoOpen: false,
        timestamp: new Intl.DateTimeFormat("en-GB", {
          dateStyle: "full",
          timeStyle: "short",
        }).format(doc.data().timestamp.toDate()),
      })
    })
    setOpenSeasonsList(openSeasonsSnapshot)
  }

  const handleInfoOpen = openSeasonIndex => {
    const updateSeasonsList = openSeasonsList.map((season, seasonIndex) =>
      seasonIndex === openSeasonIndex
        ? {
            ...season,
            infoOpen: !season.infoOpen,
          }
        : { ...season }
    )
    setOpenSeasonsList(updateSeasonsList)
  }

  useEffect(() => {
    fetchOpenSeasons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Router />
      {!openSeasonsList.length && <div>There are no Open Seasons!</div>}
      <div className="bg-white">
        {openSeasonsList.map((openSeason, openSeasonIndex) => (
          <div
            className="grid grid-cols-5 border-2 border-black p-2"
            key={`previous-season-${openSeasonIndex}`}
          >
            <div className="col-span-4 self-center">
              <Link
                to={`/new-season/?id=${openSeason.docId}`}
                className="text-red-500 hover:underline text-sm sm:text-base font-bold"
              >
                {openSeason.timestamp}
              </Link>
              {openSeason.infoOpen && (
                <div>
                  <strong>Drivers</strong>
                  {openSeason.drivers.map(driver => (
                    <div>{driver.name}</div>
                  ))}
                </div>
              )}
            </div>
            <InformationCircleIcon
              className="h-8 w-8 text-black cursor-pointer place-self-end hover:text-gray-500 self-start"
              onClick={() => handleInfoOpen(openSeasonIndex)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default OpenSeasons
