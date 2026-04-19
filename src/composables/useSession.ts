// composables/useSession.ts

import { ref, onUnmounted } from "vue";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";
import type { Session } from "../types";

function generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function useSession() {
    const createSession = async (
        quizId: string,
        hostUid: string,
    ): Promise<string> => {
        const code = generateCode();

        await setDoc(doc(db, "sessions", code), {
            code,
            quizId,
            hostUid,
            status: "waiting",
            createdAt: Date.now(),
        });

        return code;
    };

    const useSessionByCode = (code: string) => {
        const session = ref<Session | null>(null);
        const loading = ref(true);
        const error = ref<Error | null>(null);

        const unsubscribe = onSnapshot(
            doc(db, "sessions", code),
            (snap) => {
                if (snap.exists()) {
                    session.value = snap.data() as Session;
                } else {
                    session.value = null;
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
            session,
            loading,
            error,
        };
    };

    return {
        createSession,
        useSessionByCode,
    };
}
