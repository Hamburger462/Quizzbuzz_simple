import { ref, onUnmounted } from "vue";
import { db } from "../firebase";
import { collection, setDoc, getDoc, doc, onSnapshot } from "firebase/firestore";
import type { Player, Answer } from "../types";

import { useAuth } from "./useAuth";

export const useQuizTimer = (payload: {
    qDuration: number;
}) => {
    const remainingSeconds = ref(0);
    const remainingTime = ref(0);
    const isExpired = ref(false);

    let interval: number;

    const stopTimer = () => {
        clearInterval(interval);
    };

    const update = (startedAt: number) => {
        const endAt = startedAt + payload.qDuration;
        const now = Date.now();
        const remainingMs = endAt - now;

        remainingTime.value = remainingMs;
        remainingSeconds.value = Math.max(0, Math.ceil(remainingMs / 1000));

        if (remainingMs <= 0) {
            isExpired.value = true;
            stopTimer();
        }
    };

    const startTimer = (startedAt: number) => {
        stopTimer(); // clear any previous interval before starting a new one
        isExpired.value = false;
        update(startedAt); // run immediately so the display is correct right away
        interval = setInterval(() => update(startedAt), 100);
    };

    onUnmounted(() => clearInterval(interval));

    return {
        remainingSeconds,
        remainingTime,
        isExpired,
        startTimer,
        stopTimer,
    };
};

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
        questions: Record<string, Answer>,
    ): Promise<void> => {
        await setDoc(
            doc(db, "sessions", sessionCode, "players", userId),
            {
                questions,
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

    const getPlayerById = async (sessionId: string, playerId: string) => {
        const player = await getDoc(doc(db, "sessions", sessionId, "players", playerId));

        return player.data();
    }

    return {
        addPlayer,
        addPlayerAnswer,
        addPlayerScore,
        changePlayerStatus,
        usePlayersBySession,
        usePlayerById,
        getPlayerById,
    };
}