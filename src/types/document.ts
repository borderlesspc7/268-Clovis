// Tipos de campos nos documentos
export type FieldType = "standard" | "extracted" | "manual";

// Interface para um campo do documento
export interface DocumentField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  value: string;
  required: boolean;
  placeholder?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

// Interface para um template de documento
export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  type: "memorial_descritivo" | "requerimento" | "declaracao_limites";
  fields: DocumentField[];
  standardFields: DocumentField[]; // Campos que são padrão para este tipo
  extractedFields: DocumentField[]; // Campos que vêm da leitura do PDF
  manualFields: DocumentField[]; // Campos que o usuário deve preencher
}

// Interface para um documento gerado
export interface GeneratedDocument {
  id: string;
  projectId: string;
  templateId: string;
  name: string;
  type: "memorial_descritivo" | "requerimento" | "declaracao_limites";
  fields: DocumentField[];
  status: "draft" | "completed" | "generated";
  createdAt: string;
  updatedAt: string;
  generatedAt?: string;
  fileUrl?: string;
}

// Interface para dados extraídos do PDF
export interface ExtractedData {
  projectId: string;
  pdfUrl: string;
  extractedFields: {
    [fieldId: string]: string;
  };
  confidence: number;
  extractedAt: string;
  status: "processing" | "completed" | "failed";
}
