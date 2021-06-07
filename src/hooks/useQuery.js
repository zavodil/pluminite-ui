import { useLocation } from 'react-router-dom';

export const useQuery = () => new URLSearchParams(useLocation().search);

export const useNativeQuery = () => new URLSearchParams(window.location.search);
