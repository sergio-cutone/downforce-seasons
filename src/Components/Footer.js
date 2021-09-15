import React from "react"
import reactImg from "../img/react.png"
import firebaseImg from "../img/firebase.png"
import tailwindcss from "../img/tailwindcss.png"

const Footer = () => {
  const date = new Date()
  return (
    <div className="p-5 text-center bg-white mt-5 border-t-2 border-black">
      <div>Copyright {date.getFullYear()} Sergio Cutone</div>
      <div className="p-2 text-center">
        <img
          src={reactImg}
          className="m-auto w-12 inline"
          alt="React"
          title="React"
        />
        <img
          src={firebaseImg}
          className="m-auto w-12 inline"
          alt="FireBase"
          title="FireBase"
        />
        <img
          src={tailwindcss}
          className="m-auto w-12 inline"
          alt="TailwindCSS"
          title="TailwindCSS"
        />
      </div>
    </div>
  )
}

export default Footer
