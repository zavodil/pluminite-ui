import { useLocation } from 'react-router-dom';

export const useSearchParams = () => new URLSearchParams(useLocation().search);

export const useNativeSearchParams = () => new URLSearchParams(window.location.search);
