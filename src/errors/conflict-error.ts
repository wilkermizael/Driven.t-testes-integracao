import { ApplicationError } from '@/protocols';

export function conflictError(message: string): ApplicationError {
  return {
    name: 'ConflictError',
    message,
  };
}

export function notPaid(message: string): ApplicationError {
  return {
    name: 'NotPaid',
    message,
  };
}
