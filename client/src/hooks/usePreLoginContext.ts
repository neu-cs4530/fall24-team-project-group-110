import { useContext } from 'react';
import PreLoginContext, { PreLoginContextType } from '../contexts/PreLoginContext';

const usePreLoginContext = (): PreLoginContextType => {
  const context = useContext(PreLoginContext);

  if (context === null) {
    throw new Error('Pre-login context is null.');
  }

  return context;
};

export default usePreLoginContext;
