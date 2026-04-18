// composables/useQuiz.ts

import { db } from "../firebase"
import {
  collection,
  addDoc,
  type DocumentReference
} from "firebase/firestore"
import type { Question } from "../types"

export function useQuiz() {

  const createQuiz = async (
    title: string,
    userId: string
  ): Promise<string> => {

    const docRef = await addDoc(collection(db, "quizzes"), {
      title,
      createdBy: userId,
      createdAt: Date.now()
    })

    return docRef.id
  }

  const addQuestion = async (
    quizId: string,
    question: Question
  ): Promise<DocumentReference> => {

    const questionsRef = collection(db, "quizzes", quizId, "questions")

    return addDoc(questionsRef, {
      text: question.text,
      choices: question.choices,
      correctAnswer: question.correctAnswer,
      timeLimit: question.timeLimit ?? 20
    })
  }

  return {
    createQuiz,
    addQuestion
  }
}