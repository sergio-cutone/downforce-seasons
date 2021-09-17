# Downforce Seasons

---

## Installation

> npm install

### Firebase Settings

**Firebase Database Structure Example**

> Collection: races > Document is auto created / populated
> Collection: tracks > Track > Field is auto auto created / populated
> Collection: drivers > Driver > Field is auto auto created / populated

**Add the Firebase Config file with your config settings:**

> services/fb-config.js

**Content**

> const fbConfig = {\
> apiKey: "<-- API KEY -->",\
> authDomain: "<-- AUTH DOMAIN -->",\
> databaseURL: "<-- DATABASE URL -->",\
> projectId: "<-- PROJECT ID -->",\
> storageBucket: "<-- STORAGE BUCKET -->",\
> messagingSenderId: "<-- MESSAGING SENDER ID -->",\
> appId: "<-- APP ID -->",\
> }\
> module.exports = fbConfig

**Add the Firebase Collection file with your collection name:**

> services/fb-collection.js

**Content**

> const fbRaces = "<-- NAME OF RACES COLLECTION (races)-->"
> const fbTracks = "<-- NAME OF COLLECTION (tracks)-->"
> const fbDrivers = "<-- NAME OF COLLECTION (drivers)-->"

export { fbRaces, fbTracks, fbDrivers }

### Development

> npm run start

### Build

> npm run build
