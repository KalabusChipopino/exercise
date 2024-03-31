"use client";
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { context } from './globals';

const mainContext = createContext(context);

export function Context({ children }: { children: ReactNode }) {

    const [value, setValue] = useState(context);

    return <mainContext.Provider value={value}>
        {children}
    </mainContext.Provider>
}


export default function useCtn() {
    return useContext(mainContext);
}