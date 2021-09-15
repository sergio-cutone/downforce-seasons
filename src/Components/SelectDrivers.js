import React, { useEffect, useState } from "react"
import fetchDrivers from "../helpers/fb-Drivers"
import { Link } from "react-router-dom"

const SelectDrivers = ({ numberOfDrivers, handleEnterPlayerNames }) => {
  const [drivers, setDrivers] = useState([])
  const fetchData = async () => {
    setDrivers(await fetchDrivers())
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <h1 className="font-bold text-2xl block mb-2">Select Drivers</h1>

      {drivers.length ? (
        numberOfDrivers.map((driverNumber, driverNumberIndex) => {
          return (
            <select
              className="p-2 border-2 border-black w-full bg-white mb-2"
              onChange={e => handleEnterPlayerNames(e, driverNumberIndex)}
              key={`driver-number-${driverNumberIndex}`}
            >
              <option value="" key={`option-null`}>
                - - -
              </option>
              {drivers.sort().map(name => (
                <option value={name} key={`option-${name}`}>
                  {name}
                </option>
              ))}
            </select>
          )
        })
      ) : (
        <div className="mb-3">
          There are no saved Drivers.{" "}
          <div>
            <Link to="/drivers" className="button-grey">
              Add Drivers
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectDrivers
