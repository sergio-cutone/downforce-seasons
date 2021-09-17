import { doc, getDoc } from "firebase/firestore"
import firestore from "../services/firestore"
import { fbDrivers } from "../services/fb-collection"

var db = firestore.firestore()
db.settings({
  timestampsInSnapshots: true,
})

const fetchDrivers = async () => {
  const docRef = doc(db, fbDrivers, "driver")
  const docSnap = await getDoc(docRef)
  return docSnap.data().name ? docSnap.data().name : []
}

export default fetchDrivers
