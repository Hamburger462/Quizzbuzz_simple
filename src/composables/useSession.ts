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

    const changeSessionStatus = async (code: string, status: string) => {
        switch (status) {
            case "active":
                await setDoc(
                    doc(db, "sessions", code),
                    {
                        status: "active",
                    },
                    { merge: true },
                );
                break;
            case "finished":
                await setDoc(
                    doc(db, "sessions", code),
                    {
                        status: "finished",
                    },
                    { merge: true },
                );
                break;
        }
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
        changeSessionStatus,
    };
}

export function shuffleQuestions<T>(questions: T[]): T[] {
  const arr = [...questions]; // clone

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}