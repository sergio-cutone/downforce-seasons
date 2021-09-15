import React, { useEffect, useState } from "react"
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore"
import { XIcon } from "@heroicons/react/solid"
import fetchTracks from "../helpers/fb-Tracks"
import { FilterChars, InputVerification } from "../helpers/core"

const Tracks = ({ db }) => {
  const [tracks, setTracks] = useState([])
  const [isAddTrack, setIsAddTrack] = useState(false)
  const [newTrack, setNewTrack] = useState("")
  const [isConfirmDeleteTrack, setIsConfirmDeleteTrack] = useState(false)
  const [deleteTrackConfirm, setDeleteTrackConfirm] = useState()
  const [formErrors, setFormErrors] = useState([])

  const handleNewTrack = trackName => {
    const trackNameFilter = FilterChars(trackName.target.value)
    setFormErrors(InputVerification(trackNameFilter, tracks))
    setNewTrack(trackNameFilter)
  }

  const handleDeleteTrack = async deleteTrack => {
    await updateDoc(doc(db, "tracks", "track"), {
      name: arrayRemove(deleteTrack),
    })
    fetchData()
  }

  const resetForm = () => {
    setNewTrack("")
    setFormErrors([])
    setIsAddTrack(false)
  }

  const addTrack = async () => {
    if (newTrack) {
      await updateDoc(doc(db, "tracks", "track"), {
        name: arrayUnion(newTrack.trim()),
      })
      fetchData()
      resetForm()
    }
  }

  const fetchData = async () => {
    setTracks(await fetchTracks(db))
  }

  const confirmDeleteTrack = track => {
    setDeleteTrackConfirm(track)
    setIsConfirmDeleteTrack(true)
  }

  const onHandleNewTrack = keyDown => {
    if (keyDown.key === "Enter") {
      !formErrors.length && addTrack()
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddTrack])

  return (
    <div>
      {isConfirmDeleteTrack && (
        <div className="bg-black bg-opacity-80 w-full h-full p-6 z-10 absolute top-0 left-0">
          <div className="max-w-lg bg-white p-5 rounded-lg mx-auto border-2 border-black">
            <strong>Delete Track: {deleteTrackConfirm}?</strong>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <button
                onClick={() => {
                  handleDeleteTrack(deleteTrackConfirm)
                  setIsConfirmDeleteTrack(false)
                }}
              >
                Delete
              </button>
              <button
                className="button-yellow"
                onClick={() => {
                  setIsConfirmDeleteTrack(false)
                  setDeleteTrackConfirm()
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {tracks.length > 0 ? (
        tracks.sort().map((track, trackIndex) => (
          <div
            className="grid grid-cols-4 border-2 border-black bg-white font-bold relative"
            key={`track-${trackIndex}`}
          >
            <div className="p-2 col-span-3 self-center">{track}</div>
            <div className="p-2 place-self-end">
              <XIcon
                className="h-8 w-8 rounded-md bg-red-500 text-white border-2 border-black cursor-pointer hover:bg-red-700"
                onClick={() => confirmDeleteTrack(track)}
              />
            </div>
          </div>
        ))
      ) : (
        <div>No saved tracks exist! Add a track.</div>
      )}
      {isAddTrack && (
        <>
          <input
            type="text"
            className="p-2 border-2 border-black w-full text-center my-3 bg-yellow-100"
            onChange={e => handleNewTrack(e)}
            placeholder="Enter Track Name"
            onKeyDown={e => onHandleNewTrack(e)}
            value={newTrack}
          />
          {formErrors.map(error => (
            <div className="mb-3">{error}</div>
          ))}
        </>
      )}
      {isAddTrack && (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => resetForm()}>Cancel</button>
          {!formErrors.length && (
            <button className="button-yellow" onClick={() => addTrack()}>
              Save Track
            </button>
          )}
        </div>
      )}
      {!isAddTrack && (
        <div>
          <button
            className="button-grey my-3"
            onClick={() => setIsAddTrack(true)}
          >
            Add Track
          </button>
        </div>
      )}
    </div>
  )
}

export default Tracks
