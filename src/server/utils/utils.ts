import { ToolResponse } from "../types/Tools";

export function formatResponse(data: any, count: number, entityName: string): string {
  return `Retrieved ${count} ${entityName}:\n${JSON.stringify(data, null, 2)}`;
}

export function formatDetailResponse(data: any, id: string | number, entityName: string): string {
  return `${entityName} details for ID ${id}:\n${JSON.stringify(data, null, 2)}`;
}

export function formatSuccessMessage(message: string): string {
  return `Successfully ${message}`;
}

export function createTextContent(text: string): ToolResponse {
  return {
    content: [
      {
        type: 'text' as const,
        text,
      },
    ],
  };
}

export function extractArrayLength(data: any, path: string[]): number {
  let current = data;
  for (const key of path) {
    current = current?.[key];
  }
  return Array.isArray(current) ? current.length : 0;
}

export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

export function validateRequiredParams(args: any, required: string[]): void {
  for (const param of required) {
    if (args[param] === undefined || args[param] === null) {
      throw new Error(`Missing required parameter: ${param}`);
    }
  }
} 