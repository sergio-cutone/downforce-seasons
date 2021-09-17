import React, { useState, useEffect } from "react"
import logo from "../img/logo.png"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")

  const handleAutoSignIn = () => {
    setEmail("demo@sergiocutone.com")
    setPassword("1234567")
  }

  const handleEmail = email => {
    setErrorMessage("")
    setEmailError(false)
    setEmail(email.target.value)
  }

  const handlePassword = password => {
    setErrorMessage("")
    setPasswordError(false)
    setPassword(password.target.value)
  }

  const handleLogin = () => {
    setErrorMessage("")
    setEmailError(false)
    setPasswordError(false)
    if (!email || !password) {
      !email && setEmailError(true)
      !password && setPasswordError(true)

      return false
    }
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        setIsLoggedIn(true)
        // ...
      })
      .catch(error => {
        const errorMessage = error.message
        setErrorMessage(errorMessage)
        // ..
      })
  }

  useEffect(() => {
    const url_string = window.location.href
    const url = new URL(url_string)
    const email = url.searchParams.get("email") || ""
    if (email) {
      setEmail(email)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full h-full bg-opacity-80 bg-black p-8 fixed top-0 left-0 z-10">
      <div className="max-w-lg p-5 text-center bg-gray-400 m-auto border-2 border-black">
        <img
          src={logo}
          className="max-h-20 m-auto px-2 mb-5"
          alt="logo"
          onClick={handleAutoSignIn}
        />
        <form
          onSubmit={e => {
            e.preventDefault()
          }}
        >
          <div>
            <strong>Email</strong>
          </div>
          <div className="mb-5">
            <input
              type="email"
              className="p-2 border-2 border-black w-full"
              onChange={e => handleEmail(e)}
              value={email}
            />
            {emailError && (
              <div className="text-red-800">
                Please enter your Email address
              </div>
            )}
          </div>
          <div>
            <strong>Password</strong>
          </div>
          <div className="mb-5">
            <input
              type="password"
              className="p-2 border-2 border-black w-full"
              onChange={e => handlePassword(e)}
              value={password}
            />
            {passwordError && (
              <div className="text-red-800">Please enter your Password</div>
            )}
          </div>
          {errorMessage && <div>{errorMessage}</div>}
          <button className="button-grey" onClick={handleLogin}>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
