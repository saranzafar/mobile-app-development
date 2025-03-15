import React, { createContext, FC, PropsWithChildren, useState } from 'react';
import AppwriteService from './service';

type AppContextType = {
    appwrite: AppwriteService;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const AppwriteContext = createContext<AppContextType>({
    appwrite: new AppwriteService(),
    isLoggedIn: false,
    setIsLoggedIn: () => { },
});

export const AppwriteProvider: FC<PropsWithChildren> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const defaultValues = {
        appwrite: new AppwriteService(),
        isLoggedIn,
        setIsLoggedIn,
    };

    return (
        <AppwriteContext.Provider value={defaultValues}>
            {children}
        </AppwriteContext.Provider>
    );
};
