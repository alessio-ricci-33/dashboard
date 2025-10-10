'use client';
import {
	createContext,
	useContext,
	useState,
	ReactNode,
	SetStateAction,
	Dispatch,
	useEffect,
} from 'react';

interface GlobalContextValue {
	isRecording: boolean;
	setIsRecording: Dispatch<SetStateAction<boolean>>;
}

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined);

interface GlobalProviderProps {
	children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
	const [isRecording, setIsRecording] = useState<boolean>(false);

	useEffect(() => {
		document
			.querySelectorAll('#entry > *')
			.forEach(el => el.classList.toggle('hidden', isRecording));
	}, [isRecording]);

	return (
		<GlobalContext.Provider
			value={{
				isRecording,
				setIsRecording,
			}}>
			{children}
		</GlobalContext.Provider>
	);
};

/**
 * Custom hook per accedere al Global Context
 * Lancia un errore se usato fuori dal GlobalProvider
 */
export const useGlobalContext = (): GlobalContextValue => {
	const context = useContext(GlobalContext);
	if (!context) {
		throw new Error('useGlobalContext deve essere usato all’interno di un GlobalProvider');
	}
	return context;
};
