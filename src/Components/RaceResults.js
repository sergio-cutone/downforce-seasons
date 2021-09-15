import React, { useState, useEffect } from "react"
import fetchTracks from "../helpers/fb-Tracks"
import SeasonTable from "./SeasonTable"

const RaceResults = ({
  nextRace,
  gameState,
  handleRaceResults,
  handleSetTrack,
  isSetFinalResults,
}) => {
  const drivers = isSetFinalResults
    ? gameState.drivers.sort(
        (a, b) => b.races[nextRace].money - a.races[nextRace].money
      )
    : gameState.drivers

  const [tracks, setTracks] = useState([])
  const [isSeasonTable, setIsSeasonTable] = useState(false)

  const fetchData = async () => {
    setTracks(await fetchTracks())
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <div className="my-5">
        <div
          onClick={() => setIsSeasonTable(!isSeasonTable)}
          className="p-2 font-bold bg-white shadow-xl rounded-md hover:bg-black hover:text-white cursor-pointer"
        >
          Show Standings
        </div>
      </div>
      {isSeasonTable && <SeasonTable gameState={gameState} />}
      <h1 className="font-bold text-2xl block mt-3">
        Race {nextRace + 1} / {gameState.season.length}
      </h1>
      <div>Select track and enter money earned after race.</div>
      <select
        className="font-bold p-2 border-2 border-black mt-3"
        onChange={track => handleSetTrack(track)}
      >
        <option value="">-- Select Track --</option>
        {tracks.map((track, trackIndex) => (
          <option value={track} key={`track-${trackIndex}`}>
            {track}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-3 gap-4 p-2 font-bold">
        <div>Driver</div>
        <div>Money</div>
        <div>Pts</div>
      </div>
      {drivers.map((driver, driverIndex) => {
        return (
          <div
            className="border-2 border-black bg-white p-2"
            key={`driver-${driverIndex}`}
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="font-bold p-2">{driver.name}</div>
              <div>
                <input
                  type="number"
                  placeholder={`Score`}
                  className="p-2 border-2 border-black w-full text-center bg-yellow-100"
                  onChange={e => handleRaceResults(e, driverIndex)}
                  value={
                    driver.races[nextRace].money
                      ? driver.races[nextRace].money
                      : ""
                  }
                  maxLength="3"
                  min="0"
                />
              </div>
              <div className="p-2 text-xs">
                {gameState.racePointsBreakdown[driverIndex]}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RaceResults
