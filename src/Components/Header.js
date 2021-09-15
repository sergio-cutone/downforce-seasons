import React, { useState } from "react"
import { BrowserRouter as Router, Link } from "react-router-dom"
import { MenuIcon } from "@heroicons/react/solid"
import logo from "../img/logo.png"

const Header = () => {
  const [isMenu, setIsMenu] = useState(false)
  return (
    <>
      <Router />
      <Link to="/">
        <img src={logo} className="max-h-20 m-auto px-8 mb-5" alt="logo" />
      </Link>
      <MenuIcon
        className="h-8 w-8 text-black absolute top-2 right-2 rounded-md bg-white border-2 border-black cursor-pointer hover:bg-black hover:text-white"
        onClick={() => setIsMenu(!isMenu)}
      />
      {isMenu && (
        <ul className="transition duration-700 ease-in-out shadow-xl my-3 bg-blue-900 text-white font-bold">
          <li>
            <Link
              to="/"
              className="p-2 block border hover:bg-black hover:text-blue-900 hover:bg-white"
              onClick={() => setIsMenu(!isMenu)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/new-season"
              className="p-2 block border hover:bg-black hover:text-blue-900 hover:bg-white"
              onClick={() => setIsMenu(!isMenu)}
            >
              New Season
            </Link>
          </li>
          <li>
            <Link
              to="/previous-seasons"
              className="p-2 block border hover:bg-black hover:text-blue-900 hover:bg-white"
              onClick={() => setIsMenu(!isMenu)}
            >
              Previous Seasons
            </Link>
          </li>
          <li>
            <Link
              to="/open-seasons"
              className="p-2 block border hover:bg-black hover:text-blue-900 hover:bg-white"
              onClick={() => setIsMenu(!isMenu)}
            >
              Open Seasons
            </Link>
          </li>
          <li>
            <Link
              to="/drivers"
              className="p-2 block border hover:bg-black hover:text-blue-900 hover:bg-white"
              onClick={() => setIsMenu(!isMenu)}
            >
              Drivers
            </Link>
          </li>
          <li>
            <Link
              to="/tracks"
              className="p-2 block border hover:bg-black hover:text-blue-900 hover:bg-white"
              onClick={() => setIsMenu(!isMenu)}
            >
              Tracks
            </Link>
          </li>
        </ul>
      )}
    </>
  )
}

export default Header
