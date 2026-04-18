// composables/useAuth.ts

import { ref } from "vue"
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser
} from "firebase/auth"
import { auth } from "../firebase"

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

  const register = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const loginAnonymously = () => {
    return signInAnonymously(auth)
  }

  const logout = () => signOut(auth)

  return {
    user,
    loading,
    login,
    register,
    loginAnonymously,
    logout
  }
}