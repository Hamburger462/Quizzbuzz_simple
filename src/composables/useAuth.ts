import { ref } from "vue"
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser
} from "firebase/auth"
import { doc, setDoc, onSnapshot } from "firebase/firestore"
import { auth, db } from "../firebase"
import type { User } from "../types"

const user = ref<FirebaseUser | null>(null)
const loading = ref<boolean>(true)

onAuthStateChanged(auth, (u) => {
  user.value = u
  loading.value = false
})

export function useAuth() {

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const { uid } = credential.user

    // Derive a default username from the email local-part
    const username = email.split("@")[0]

    const userDoc: User = {
      uid,
      email,
      username,
      isAnonymous: false,
    }

    await setDoc(doc(db, "users", uid), userDoc)

    return credential
  }

  const loginAnonymously = () => {
    return signInAnonymously(auth)
  }

  const logout = () => signOut(auth)

  // Reactive snapshot of the current user's Firestore doc.
  // Call this inside a component — it cleans up on unmount.
  const useUserDoc = (uid: string) => {
    const userDoc = ref<User | null>(null)
    const docLoading = ref(true)

    const unsubscribe = onSnapshot(
      doc(db, "users", uid),
      (snapshot) => {
        userDoc.value = snapshot.exists()
          ? (snapshot.data() as User)
          : null
        docLoading.value = false
      },
      () => {
        docLoading.value = false
      }
    )

    // Components using this should call unsubscribe on unmount,
    // or wrap in onUnmounted themselves.
    return { userDoc, docLoading, unsubscribe }
  }

  const updateUserDoc = async (uid: string, data: Partial<User>) => {
    await setDoc(doc(db, "users", uid), data, { merge: true })
  }

  return {
    user,
    loading,
    login,
    register,
    loginAnonymously,
    logout,
    useUserDoc,
    updateUserDoc,
  }
}