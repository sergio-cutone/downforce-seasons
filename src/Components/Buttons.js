import React from "react"

const Buttons = ({ handleSelectPlayer }) => {
  const players = new Array(5).fill(0)
  return (
    <>
      <h1 className="font-bold text-2xl block mb-2">How Many Drivers?</h1>
      <div className="grid grid-cols-2 gap-4">
        {players.map((player, playerIndex) => (
          <button
            className="button-grey"
            onClick={() => handleSelectPlayer(playerIndex + 2)}
            key={`button-${playerIndex}`}
          >
            {playerIndex + 2}
          </button>
        ))}
      </div>
    </>
  )
}

export default Buttons
