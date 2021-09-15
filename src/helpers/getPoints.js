const getPoints = (racingResults, raceScoring) => {
  let tmpDupes = []
  const cleanArray = []

  for (let i = 0; i < racingResults.length; i++) {
    if (racingResults[i] === racingResults[i + 1]) {
      tmpDupes.push(racingResults[i])
    } else {
      tmpDupes.push(racingResults[i])
      cleanArray.push(tmpDupes)
      tmpDupes = []
    }
  }

  let pointsCount = 0
  const pointsBreakdown = []
  for (let i = 0; i < cleanArray.length; i++) {
    if (cleanArray[i].length === 1) {
      pointsBreakdown.push(raceScoring[pointsCount])
      pointsCount = pointsCount + 1
    } else {
      let accumulated = 0
      for (let a = 0; a < cleanArray[i].length; a++) {
        accumulated = accumulated + raceScoring[pointsCount]
        pointsCount = pointsCount + 1
      }
      for (let b = 0; b < cleanArray[i].length; b++) {
        pointsBreakdown.push(
          Math.round((accumulated / cleanArray[i].length) * 100) / 100
        )
      }
    }
  }
  return pointsBreakdown
}

export default getPoints
