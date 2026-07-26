export type ScreeningQuestionType =
  | "text"
  | "single-select"
  | "multi-select"
  | "file upload"
  | "yes/no"
  | "numeric";

export interface ScreeningQuestion {
  id: string;
  label: string;
  type: ScreeningQuestionType;
  required: boolean;
  options?: string[]; // required for single-select and multi-select
}

export interface ScreeningAnswer {
  questionId: string;
  value: string;
}
