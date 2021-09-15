import React, { useEffect, useState } from "react"

const SeasonTable = ({ gameState }) => {
  const [standings, setStandings] = useState([])
  const [raceDetails, setRaceDetails] = useState([])

  useEffect(() => {
    const fetchStandings = () => {
      const racers = []
      gameState.drivers.forEach(driver => {
        let money = 0
        let points = 0
        driver.races.forEach(race => {
          money = money + race.money
          points = points + race.points
        })
        racers.push({ name: driver.name, money: money, points: points })
      })
      return racers.sort((a, b) => b.points - a.points)
    }
    setStandings(fetchStandings())

    const fetchRaceByRace = () => {
      const raceByRace = []
      gameState.season.forEach((season, seasonIndex) => {
        const driverRaceInfo = []
        let track = ""
        gameState.drivers.forEach(driver => {
          driverRaceInfo.push({
            ...driver.races[seasonIndex],
            name: driver.name,
          })
          track = driver.races[seasonIndex].track
        })
        raceByRace.push({
          track: track,
          detail: driverRaceInfo.sort((a, b) => b.points - a.points),
        })
      })
      setRaceDetails(raceByRace)
    }
    fetchRaceByRace()
  }, [gameState])

  return (
    <div>
      <h1 className="font-bold text-2xl block my-3">Season Results</h1>
      <div className="grid grid-cols-3 gap-4 text-center p-2 font-bold text-sm sm:text-base">
        <div>Driver</div>
        <div>Money</div>
        <div>Points</div>
      </div>
      {standings.map((driver, driverIndex) => (
        <div
          className={`grid grid-cols-3 gap-4 font-bold border-2 border-black p-1 ${
            driverIndex === 0 ? "bg-yellow-200" : "bg-white"
          }`}
          key={`driver-results-${driverIndex}`}
        >
          <div
            className="text-sm sm:text-base"
            key={`driver-name-results-${driverIndex}`}
          >
            {driver.name}
          </div>
          <div
            className="text-sm sm:text-base"
            key={`driver-money-results-${driverIndex}`}
          >
            ${driver.money}M
          </div>
          <div
            className="text-sm sm:text-base"
            key={`driver-points-results-${driverIndex}`}
          >
            {driver.points}
          </div>
        </div>
      ))}
      <h1 className="font-bold text-2xl block my-3">Races</h1>
      <div className="grid grid-cols-3 gap-4 font-bold border-2 border-black p-1 bg-gray-200">
        <div>Driver</div>
        <div>Money</div>
        <div>Points</div>
      </div>
      {raceDetails.map((race, raceIndex) => (
        <div key={`race-details-${raceIndex}`} className="bg-white">
          <div
            className="bg-black text-white font-bold p-1"
            key={`race-track-${raceIndex}`}
          >
            {race.track}
          </div>
          <div
            className="grid grid-cols-3 gap-4 font-bold border-2 border-black p-1"
            key={`race-detail-${raceIndex}`}
          >
            {race.detail.map((driver, driverIndex) => (
              <>
                <div key={`driver-name-${driverIndex}`}>{driver.name}</div>
                <div key={`driver-money-${driverIndex}`}>${driver.money}M</div>
                <div key={`driver-points-${driverIndex}`}>{driver.points}</div>
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SeasonTable
