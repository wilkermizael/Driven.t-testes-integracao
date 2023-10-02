import { ApplicationError } from '@/protocols';

export function notPaid(): ApplicationError {
  return {
    name: 'NotPaid',
    message: 'Você deve pagar o ticket',
  };
}
