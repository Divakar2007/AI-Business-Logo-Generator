
export interface UserInput {
  industry: string;
  preferences: string;
}

export interface GeneratedResult {
  name: string;
  description: string;
  pngBase64: string;
  svgCode: string;
}

export interface NameIdea {
    name: string;
    description: string;
}
