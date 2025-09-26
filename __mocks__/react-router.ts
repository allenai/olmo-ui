import { IDLE_NAVIGATION } from 'react-router';

/* eslint-disable import/export */
export * from 'react-router';

export const useParams = vi.fn(() => ({}));
export const useNavigate = vi.fn();
export const useNavigation = vi.fn(() => IDLE_NAVIGATION);
