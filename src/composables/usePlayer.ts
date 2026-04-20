import { ref, onUnmounted } from "vue";
import { db } from "../firebase";
import {
    collection,
    setDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";
import type { Player } from "../types";

import { useAuth } from "./useAuth";

export function usePlayers() {
    const addPlayer = async (sessionCode: string, nickname: string) => {
        const { user } = useAuth();
        if (!user.value) return;

        await setDoc(
            doc(db, "sessions", sessionCode, "players", user.value.uid),
            {
                nickname: nickname,
                score: 0,
                finished: false,
                joinedAt: Date.now(),
            },
        );
    };

    const usePlayersBySession = (sessionCode: string) => {
        const players = ref<Player[]>([]);
        const loading = ref(true);
        const error = ref<Error | null>(null);

        const unsubscribe = onSnapshot(
            collection(db, "sessions", sessionCode, "players"),
            (snapshot) => {
                players.value = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Player, "id">),
                }));
                loading.value = false;
            },
            (err) => {
                error.value = err;
                loading.value = false;
            },
        );

        onUnmounted(() => {
            unsubscribe();
        });

        return {
            players,
            loading,
            error,
        };
    };

    return {
        usePlayersBySession,
        addPlayer,
    };
}
