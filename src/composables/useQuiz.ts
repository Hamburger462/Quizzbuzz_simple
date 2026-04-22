// src/composables/useQuiz.ts
import { ref, onUnmounted } from "vue";
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    deleteDoc,
    query,
    where,
    orderBy, // Added this
    onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";
import type { Quiz } from "../types";

export function encodeChoice(choice: string, seed: string) {
    return btoa(`${seed}:${choice}`)
}

export function decodeChoice(encoded: string) {
    const decoded = atob(encoded)
    const [, choice] = decoded.split(":")
    return choice
}

// New composable for public discovery
export function usePublicQuizzes() {
    const quizzes = ref<Quiz[]>([]);
    const loading = ref(true);
    const error = ref<string | null>(null);

    const q = query(
        collection(db, "quizzes"),
        where("globalAvailable", "==", true),
        orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            quizzes.value = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Quiz[];
            loading.value = false;
        },
        (err) => {
            console.error(err);
            error.value = "Failed to load quizzes.";
            loading.value = false;
        }
    );

    onUnmounted(() => unsubscribe());

    return { quizzes, loading, error };
}

export function useQuiz() {
    const createQuiz = async (title: string, userId: string): Promise<string> => {
        const docRef = await addDoc(collection(db, "quizzes"), {
            title,
            ownerId: userId,
            createdAt: Date.now(),
            questions: [],
        });
        return docRef.id;
    };

    const updateQuiz = async (quizId: string, updates: Partial<Quiz>): Promise<void> => {
        await setDoc(doc(db, "quizzes", quizId), updates, { merge: true });
    };

    const readQuiz = async (quizId: string): Promise<Quiz | null> => {
        const docRef = await getDoc(doc(db, "quizzes", quizId));
        const docData = docRef.data();
        if (!docData) return null;

        return {
            id: docRef.id,
            title: docData.title,
            ownerId: docData.ownerId,
            createdAt: docData.createdAt,
            questions: docData.questions,
            globalAvailable: docData.globalAvailable
        } as Quiz;
    };

    const deleteQuiz = async (quizId: string) => {
        await deleteDoc(doc(db, "quizzes", quizId));
    };

    const useQuizById = (quizId: string) => {
        const quiz = ref<Quiz | null>(null);
        const loading = ref(true);
        const error = ref<Error | null>(null);

        const unsubscribe = onSnapshot(
            doc(db, "quizzes", quizId),
            (snapshot) => {
                if (snapshot.exists()) {
                    quiz.value = { id: snapshot.id, ...snapshot.data() } as Quiz;
                } else {
                    quiz.value = null;
                }
                loading.value = false;
            },
            (err) => {
                error.value = err;
                loading.value = false;
            },
        );

        onUnmounted(() => unsubscribe());

        return { quiz, loading, error };
    };

    return {
        createQuiz,
        updateQuiz,
        readQuiz,
        deleteQuiz,
        useQuizById,
    };
}

export function subscribeToUserQuizzes(userId: string, callback: (quizzes: Quiz[]) => void) {
    const q = query(collection(db, "quizzes"), where("ownerId", "==", userId));

    return onSnapshot(q, (snapshot) => {
        const quizzes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Quiz[];

        callback(quizzes);
    });
}