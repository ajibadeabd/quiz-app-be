import { randomBytes } from 'crypto';

export const generateQuizCode = (): string => {
  return randomBytes(8).toString('base64url');
};
