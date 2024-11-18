import { createContext } from 'react';
import { User } from '../types';

export interface PreLoginContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const PreLoginContext = createContext<PreLoginContextType | null>(null);

export default PreLoginContext;
