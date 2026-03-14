'use client';

import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from '@/store';
import { setUserInfo } from '@/store/auth-slice';
import { COOKIE_KEYS } from '@/constants/cookies';
import Cookies from 'js-cookie';

function HydrateStore({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const userInfoCookie = Cookies.get(COOKIE_KEYS.USER_INFO);
    if (userInfoCookie) {
      try {
        const userInfo = JSON.parse(userInfoCookie);
        dispatch(setUserInfo(userInfo));
      } catch (error) {
        console.error('Failed to hydrate user info from cookies:', error);
      }
    }
  }, [dispatch]);

  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <HydrateStore>{children}</HydrateStore>
    </Provider>
  );
}
