import { doc, getDoc } from "firebase/firestore"
import firestore from "../services/firestore"
import { fbTracks } from "../services/fb-collection"

var db = firestore.firestore()
db.settings({
  timestampsInSnapshots: true,
})

const fetchTracks = async () => {
  const docRef = doc(db, fbTracks, "track")
  const docSnap = await getDoc(docRef)
  return docSnap.data().name ? docSnap.data().name : []
}

export default fetchTracks
