import React from "react"

const HowManyRaces = ({ handleSelectHowManyRaces }) => {
  const races = new Array(10).fill(0)

  return (
    <div>
      <h1 className="font-bold text-2xl block mb-2">How Many Races?</h1>
      <div className="mb-3">
        <select
          className="font-bold p-2 border-2 border-black"
          onChange={e => handleSelectHowManyRaces(e)}
        >
          <option value="0">---</option>
          {races.map((race, raceIndex) => {
            return (
              <option value={raceIndex + 1} key={`race-${raceIndex}`}>
                {raceIndex + 1}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}

export default HowManyRaces
