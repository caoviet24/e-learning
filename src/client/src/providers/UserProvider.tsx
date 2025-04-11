import { accountService } from '@/services/accountService';
import { IUser } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';

interface IUserContext {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    logout: () => void;
}

export const UserContext = createContext<IUserContext>({
    user: null,
    setUser: () => {},
    logout: () => {
        accountService.logout();
    },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);

    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ['auth'],
        queryFn: accountService.auth,
        enabled: !user,
        retry: false,
    });

    useEffect(() => {
        if (isSuccess) {
            setUser(data.user);
        }
    }, [isSuccess]);
    

    const value = useMemo(
        () => ({
            user,
            setUser,
            logout: accountService.logout,
        }),
        [user],
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
