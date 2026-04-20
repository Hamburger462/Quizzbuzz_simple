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

export function useQuiz() {
    const createQuiz = async (
        title: string,
        userId: string,
    ): Promise<string> => {
        const docRef = await addDoc(collection(db, "quizzes"), {
            title,
            ownerId: userId,
            createdAt: Date.now(),
            questions: [],
        });

        return docRef.id;
    };

    const updateQuiz = async (quizId: string, updates: any): Promise<void> => {
        await setDoc(doc(db, "quizzes", quizId), updates, { merge: true });
    };

    const readQuiz = async (quizId: string): Promise<Quiz | null> => {
        const docRef = await getDoc(doc(db, "quizzes", quizId));

        const docData = docRef.data();

        if(!docData) return null;

        const quiz: Quiz = {
            title: docData.title,
            ownerId: docData.ownerId,
            createdAt: docData.createdAt,
            questions: docData.questions
        }

        return quiz;
    };

    const deleteQuiz = async (quizId: string) => {
        await deleteDoc(doc(db, "quizzes", quizId));
    };

    const useQuizById = (quizId: string) => {
        const quiz = ref<any | null>(null);
        const loading = ref(true);
        const error = ref<Error | null>(null);

        const unsubscribe = onSnapshot(
            doc(db, "quizzes", quizId),
            (snapshot) => {
                if (snapshot.exists()) {
                    quiz.value = { id: snapshot.id, ...snapshot.data() };
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

        onUnmounted(() => {
            unsubscribe();
        });

        return {
            quiz,
            loading,
            error,
        };
    };

    return {
        createQuiz,
        updateQuiz,
        readQuiz,
        deleteQuiz,
        useQuizById,
    };
}

export function subscribeToUserQuizzes(userId: string, callback: Function) {
    const q = query(collection(db, "quizzes"), where("ownerId", "==", userId));

    return onSnapshot(q, (snapshot) => {
        const quizzes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        callback(quizzes);
    });
}