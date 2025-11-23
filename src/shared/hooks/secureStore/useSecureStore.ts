import { getSecureItem } from '@/shared/utlis/storage';
import { useEffect, useState } from 'react';

const useTokenChecker = () => {
  const [isLoading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getSecureItem('access_token');
      setHasToken(!!token);
      setLoading(false);
    };

    checkAuth();
  }, []);

  return { isLoading, hasToken };
};

export { useTokenChecker };
