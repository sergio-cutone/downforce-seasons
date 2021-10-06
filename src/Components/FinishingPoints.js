import React, { useState } from "react"

const FinishingPoints = ({
  numberOfDrivers,
  handleSetFinishingPoints,
  handleSetRaceTie,
}) => {
  const [isF1Points, setIsF1Points] = useState(false)
  const [inputPoints, setInputPoints] = useState(
    new Array(parseFloat(numberOfDrivers)).fill("")
  )
  const pointsForDrivers = new Array(parseFloat(numberOfDrivers)).fill(0)
  const places = ["1st", "2nd", "3rd", "4th", "5th", "6th"]
  const f1points = [25, 18, 15, 12, 10, 8]

  const onSetFinishingPoints = (e, pointForDriverIndex) => {
    handleSetFinishingPoints(e.target.value, pointForDriverIndex)
    const newInput = [...inputPoints]
    newInput[pointForDriverIndex] = e.target.value
    setInputPoints(newInput)
  }

  const handleF1PointsButton = () => {
    if (isF1Points)
      setInputPoints(new Array(parseFloat(numberOfDrivers)).fill(""))
    for (let i = 0; i < pointsForDrivers.length; i++) {
      handleSetFinishingPoints(!isF1Points ? f1points[i] : "", i)
    }
    setIsF1Points(!isF1Points)
  }
  return (
    <div>
      <h1 className="font-bold text-2xl block mb-2">Finishing Points</h1>
      {pointsForDrivers.map((pointForDriver, pointForDriverIndex) => (
        <input
          placeholder={`${places[pointForDriverIndex]} Place`}
          type="number"
          className="p-2 w-full border-2 border-black mb-2 text-center"
          onChange={e => onSetFinishingPoints(e, pointForDriverIndex)}
          maxLength="4"
          min="0"
          key={`point-${pointForDriverIndex}`}
          value={
            isF1Points
              ? f1points[pointForDriverIndex]
              : inputPoints[pointForDriverIndex]
          }
        />
      ))}
      <button className="button-yellow mb-3" onClick={handleF1PointsButton}>
        Use F1 Point Structure
      </button>
      <h1 className="font-bold text-2xl block mb-2">Tie Rule</h1>
      <div className="mb-5">
        As per the FIA: If two or more drivers tie for a position, points are
        added together and shared equally for all those drivers who tie.
      </div>
      {/* <select
        className="p-2 w-full border-2 border-black mb-2"
        onChange={e => handleSetRaceTie(e)}
      >
        <option value="0">- - -</option>
        <option value="1">Same points for each tied driver</option>
        <option value="2">Combine points and divy by tied</option>
      </select> */}
    </div>
  )
}

export default FinishingPoints
