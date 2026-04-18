// composables/useQuiz.ts

import { db } from "../firebase";
import {
    collection,
    addDoc,
    type DocumentReference,
    query,
    where,
    onSnapshot
} from "firebase/firestore";
import type { Question } from "../types";

export function useQuiz() {
    const createQuiz = async (
        title: string,
        userId: string,
    ): Promise<string> => {
        const docRef = await addDoc(collection(db, "quizzes"), {
            title,
            ownerId: userId,
            createdAt: Date.now(),
        });

        return docRef.id;
    };

    return {
        createQuiz,
    };
}

export function subscribeToUserQuizzes(userId: string, callback: Function) {
  const q = query(
    collection(db, "quizzes"),
    where("ownerId", "==", userId)
  );

  return onSnapshot(q, (snapshot) => {
    const quizzes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    callback(quizzes);
  });
}

export function useQuestion() {
    const addQuestion = async (
        quizId: string,
        question: Question,
    ): Promise<DocumentReference> => {
        const questionsRef = collection(db, "quizzes", quizId, "questions");

        return addDoc(questionsRef, {
            text: question.text,
            choices: question.choices,
            correctAnswer: question.correctAnswer,
            timeLimit: question.timeLimit ?? 20,
        });
    };

    return {
        addQuestion,
    };
}
