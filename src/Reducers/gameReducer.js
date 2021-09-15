const DRIVERS = "DRIVERS"
const DRIVER_NAME = "DRIVER_NAME"
const NUMBER_OF_RACES = "NUMBER_OF_RACES"
const RACE_SCORING = "RACE_SCORING"
const RACE_TIE = "RACE_TIE"
const RACE_RESULTS = "RACE_RESULTS"
const RACE_POINTS = "RACE_POINTS"
const RACE_FINISHED = "RACE_FINISHED"
const UPDATE_DOC_ID = "UPDATE_DOC_ID"
const TRACK = "TRACK"
const OPEN_SEASON = "OPEN_SEASON"

const gameReducer = (state, action) => {
  switch (action.type) {
    case OPEN_SEASON: {
      return action.payload
    }
    case DRIVERS:
      let driverData = []
      for (let i = 0; i < action.payload; i++) {
        driverData.push({
          name: null,
          races: [{ money: null, points: null, track: null }],
        })
      }
      return { ...state, drivers: driverData }
    case DRIVER_NAME:
      state.drivers[action.payload.index].name = action.payload.name
      return { ...state }
    case NUMBER_OF_RACES:
      const races = new Array(parseFloat(action.payload)).fill(0)
      let existingDrivers = []
      for (let i = 0; i < state.drivers.length; i++) {
        existingDrivers.push({
          name: state.drivers[i].name,
          races: races.map(race => {
            return {
              money: null,
              points: null,
              track: null,
            }
          }),
        })
      }
      return {
        ...state,
        season: races,
        drivers: existingDrivers,
      }
    case RACE_SCORING:
      state.raceScoring[action.payload.index] = action.payload.racePoints
        ? parseFloat(action.payload.racePoints)
        : null
      return { ...state }
    case RACE_TIE:
      return { ...state, raceTie: parseFloat(action.payload) }
    case RACE_RESULTS:
      return {
        ...state,
        drivers: state.drivers.map((driver, driverIndex) =>
          action.payload.index === driverIndex
            ? {
                ...driver,
                races: driver.races.map((race, raceIndex) =>
                  raceIndex === action.payload.nextRace
                    ? {
                        money: action.payload.money
                          ? parseFloat(action.payload.money)
                          : null,
                        points: race.points ? parseFloat(race.points) : null,
                        track: race.track,
                      }
                    : race
                ),
              }
            : driver
        ),
      }
    case RACE_FINISHED:
      return {
        ...state,
        complete: action.payload.complete,
        raceNumber: action.payload.raceNumber,
        drivers: state.drivers.map((driver, driverIndex) => {
          return {
            ...driver,
            races: driver.races.map((race, raceIndex) =>
              raceIndex === action.payload.nextRace
                ? {
                    money: race.money,
                    points: parseFloat(action.payload.earnings[driverIndex]),
                    track: race.track,
                  }
                : race
            ),
          }
        }),
      }
    case UPDATE_DOC_ID:
      return {
        ...state,
        docId: action.payload,
      }
    case RACE_POINTS:
      return { ...state, racePointsBreakdown: action.payload }
    case TRACK:
      return {
        ...state,
        drivers: state.drivers.map(driver => {
          return {
            ...driver,
            races: driver.races.map((race, raceIndex) =>
              raceIndex === action.payload.nextRace
                ? {
                    money: race.money,
                    points: race.points,
                    track: action.payload.track ? action.payload.track : null,
                  }
                : race
            ),
          }
        }),
      }
    default:
      return { ...state }
  }
}

export default gameReducer
