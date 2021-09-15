import React, { useEffect, useState } from "react"
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore"
import { XIcon } from "@heroicons/react/solid"
import fetchDrivers from "../helpers/fb-Drivers"
import { FilterChars, InputVerification } from "../helpers/core"

const Drivers = ({ db }) => {
  const [drivers, setDrivers] = useState([])
  const [isAddDriver, setIsAddDriver] = useState(false)
  const [newDriver, setNewDriver] = useState("")
  const [isConfirmDeleteDriver, setIsConfirmDeleteDriver] = useState(false)
  const [deleteDriverConfirm, setDeleteDriverConfirm] = useState()
  const [formErrors, setFormErrors] = useState([])

  const handleNewDriver = driverName => {
    const driverNameFilter = FilterChars(driverName.target.value)
    setFormErrors(InputVerification(driverNameFilter, drivers))
    setNewDriver(driverNameFilter)
  }

  const handleDeleteDriver = async deleteDriver => {
    await updateDoc(doc(db, "drivers", "driver"), {
      name: arrayRemove(deleteDriver),
    })
    fetchData()
  }

  const resetForm = () => {
    setNewDriver("")
    setFormErrors([])
    setIsAddDriver(false)
  }

  const addDriver = async () => {
    if (newDriver) {
      await updateDoc(doc(db, "drivers", "driver"), {
        name: arrayUnion(newDriver.trim()),
      })
      fetchData()
      resetForm()
    }
  }

  const fetchData = async () => {
    setDrivers(await fetchDrivers(db))
  }

  const confirmDeleteDriver = driver => {
    setDeleteDriverConfirm(driver)
    setIsConfirmDeleteDriver(true)
  }

  const onHandleSaveDriver = keyDown => {
    if (keyDown.key === "Enter") {
      !formErrors.length && addDriver()
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddDriver])

  return (
    <div>
      {isConfirmDeleteDriver && (
        <div className="bg-black bg-opacity-80 w-full h-full p-6 z-10 fixed top-0 left-0">
          <div className="max-w-lg bg-white p-5 rounded-lg mx-auto border-2 border-black">
            <strong>Delete Driver: {deleteDriverConfirm}?</strong>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <button
                onClick={() => {
                  handleDeleteDriver(deleteDriverConfirm)
                  setIsConfirmDeleteDriver(false)
                }}
              >
                Delete
              </button>
              <button
                className="button-yellow"
                onClick={() => {
                  setIsConfirmDeleteDriver(false)
                  setDeleteDriverConfirm()
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {drivers.length > 0 ? (
        drivers.sort().map((driver, driverIndex) => (
          <div
            className="grid grid-cols-4 border-2 border-black bg-white font-bold relative"
            key={`driver-${driverIndex}`}
          >
            <div className="p-2 col-span-3 self-center">{driver}</div>
            <div className="p-2 place-self-end">
              <XIcon
                className="h-8 w-8 rounded-md bg-red-500 text-white border-2 border-black cursor-pointer hover:bg-red-700"
                onClick={() => confirmDeleteDriver(driver)}
              />
            </div>
          </div>
        ))
      ) : (
        <div>No saved drivers exist! Add a driver.</div>
      )}
      {isAddDriver && (
        <>
          <input
            type="text"
            className="p-2 border-2 border-black w-full text-center my-3 bg-yellow-100"
            onChange={e => handleNewDriver(e)}
            placeholder="Enter Driver Name"
            onKeyDown={e => onHandleSaveDriver(e)}
            value={newDriver}
            maxLength="12"
          />
          {formErrors.map(error => (
            <div className="mb-3">{error}</div>
          ))}
        </>
      )}
      {isAddDriver && (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => resetForm()}>Cancel</button>
          {!formErrors.length && (
            <button className="button-yellow" onClick={() => addDriver()}>
              Save Driver
            </button>
          )}
        </div>
      )}
      {!isAddDriver && (
        <div>
          <button
            className="button-grey my-3"
            onClick={() => setIsAddDriver(true)}
          >
            Add Driver
          </button>
        </div>
      )}
    </div>
  )
}

export default Drivers
