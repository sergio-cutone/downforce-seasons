import { doc, getDoc } from "firebase/firestore"
import firestore from "../Services/firestore"

var db = firestore.firestore()
db.settings({
  timestampsInSnapshots: true,
})

const fetchTracks = async () => {
  const docRef = doc(db, "tracks", "track")
  const docSnap = await getDoc(docRef)
  return docSnap.data().name
}

export default fetchTracks
