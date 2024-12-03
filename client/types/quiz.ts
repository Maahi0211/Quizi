export interface Option {
    id: number
    optionText: string
  }
  
  export interface Question {
    id: number
    questionText: string
    options: Option[]
  }
  
  export interface Quiz {
    id: number
    title: string
    description: string
    creatorName: string
    questions: Question[]
  }