import { Address } from './address';

export interface Company {
  name: string;
  email: string;
  contact: number | null;
  nif: number;
  newsletter: number;
  address: string;
}
