// composables/useSession.ts

import { ref } from "vue"
import { db } from "../firebase"
import {
  doc,
  setDoc,
  onSnapshot,
  type Unsubscribe
} from "firebase/firestore"
import type { Session } from "../types"

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function useSession() {
  const session = ref<Session | null>(null)

  const createSession = async (
    quizId: string,
    hostUid: string
  ): Promise<string> => {

    const code = generateCode()

    await setDoc(doc(db, "sessions", code), {
      code,
      quizId,
      hostUid,
      status: "waiting",
      createdAt: Date.now()
    })

    return code
  }

  const subscribeSession = (code: string): Unsubscribe => {
    return onSnapshot(doc(db, "sessions", code), (snap) => {
      session.value = snap.data() as Session
    })
  }

  return {
    session,
    createSession,
    subscribeSession
  }
}