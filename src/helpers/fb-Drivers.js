import { doc, getDoc } from "firebase/firestore"
import firestore from "../Services/firestore"

var db = firestore.firestore()
db.settings({
  timestampsInSnapshots: true,
})

const fetchDrivers = async () => {
  const docRef = doc(db, "drivers", "driver")
  const docSnap = await getDoc(docRef)
  return docSnap.data().name
}

export default fetchDrivers
