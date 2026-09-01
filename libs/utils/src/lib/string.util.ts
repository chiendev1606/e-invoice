import { v4 as uuidv4 } from 'uuid';

export const getProcessID = (prefix?: string): string => {
  return prefix ? `${prefix}-${uuidv4()}` : uuidv4();
};
