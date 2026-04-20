import { ref, onUnmounted } from "vue";
import { db } from "../firebase";
import { collection, setDoc, doc, onSnapshot } from "firebase/firestore";
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

    const addPlayerAnswer = async (
        sessionCode: string,
        userId: string,
        answers: Record<string, string>,
    ): Promise<void> => {
        await setDoc(
            doc(db, "sessions", sessionCode, "players", userId),
            {
                answers,
            },
            { merge: true },
        );
    };

    const addPlayerScore = async (
        sessionCode: string,
        userId: string,
        score: number,
    ): Promise<void> => {
        await setDoc(
            doc(db, "sessions", sessionCode, "players", userId),
            {
                score: score,
            },
            { merge: true },
        );
    };

    const changePlayerStatus = async (
        sessionCode: string,
        userId: string,
        finished: boolean,
    ): Promise<void> => {
        await setDoc(
            doc(db, "sessions", sessionCode, "players", userId),
            {
                finished: finished,
            },
            { merge: true },
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

    const usePlayerById = (sessionCode: string, playerId: string) => {
        const player = ref<Player | null>(null);
        const loading = ref(true);
        const error = ref<Error | null>(null);

        const unsubscribe = onSnapshot(
            doc(db, "sessions", sessionCode, "players", playerId),
            (snapshot) => {
                if (snapshot.exists()) {
                    player.value = {
                        id: snapshot.id,
                        ...(snapshot.data() as Omit<Player, "id">),
                    };
                } else {
                    player.value = null;
                }
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
            player,
            loading,
            error,
        };
    };

    return {
        addPlayer,
        addPlayerAnswer,
        addPlayerScore,
        changePlayerStatus,
        usePlayersBySession,
        usePlayerById
    };
}
