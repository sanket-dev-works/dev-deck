import { v4 as uuidv4 } from 'uuid';

export function generateUuidV4(uppercase: boolean): string {
  const id = uuidv4();
  return uppercase ? id.toUpperCase() : id;
}

export function generateUuids(count: number, uppercase: boolean): string[] {
  return Array.from({ length: count }, () => generateUuidV4(uppercase));
}
