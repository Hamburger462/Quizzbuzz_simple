// src/types/index.ts

export interface User {
  uid: string
  email: string
  username: string
  profile_img_url?: string
  isAnonymous: boolean
}

export interface Quiz {
  id?: string
  title: string
  ownerId: string
  createdAt: number
  questions: Question[]
  globalAvailable?: boolean
}

export interface Question {
  id: string
  text: string
  choices: string[]
  correctChoice: string | null
  timeLimit: number
}

export interface Session {
  code: string
  quizId: string
  hostUid: string
  status: "waiting" | "active" | "finished"
  createdAt: number
}

export interface Player {
  id: string
  uid: string | null
  nickname: string
  score: number
  finished: boolean
  joinedAt: number
}

export interface Answer {
  id?: string
  selected: string
  isCorrect?: boolean
  startedAt?: number
  answeredAt?: number
}