// composables/usePlayer.ts

import { ref } from "vue"
import { db } from "../firebase"
import {
  collection,
  addDoc,
  onSnapshot,
  type Unsubscribe
} from "firebase/firestore"
import type { Player } from "../types"

export function usePlayer() {
  const players = ref<Player[]>([])

  const joinSession = async (
    sessionCode: string,
    nickname: string,
    uid: string | null
  ) => {

    return addDoc(
      collection(db, "sessions", sessionCode, "players"),
      {
        uid,
        nickname,
        score: 0,
        finished: false,
        joinedAt: Date.now()
      }
    )
  }

  const subscribePlayers = (sessionCode: string): Unsubscribe => {

    return onSnapshot(
      collection(db, "sessions", sessionCode, "players"),
      (snapshot) => {
        players.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Player, "id">)
        }))
      }
    )
  }

  return {
    players,
    joinSession,
    subscribePlayers
  }
}