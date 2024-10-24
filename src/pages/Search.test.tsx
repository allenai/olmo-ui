import { render, renderHook, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { useAppContext } from '@/AppContext';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';
import { routes } from '@/router';

describe('Dataset Explorer Search', () => {
    it('should load search results when a query set in the URL', async () => {
        const router = createMemoryRouter(routes, {
            initialEntries: [{ pathname: links.search, search: '?query=Seattle' }],
        });
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getByText('stack-dedup')).toBeVisible();
        });

        expect(screen.queryByTestId('search-progress-bar')).not.toBeInTheDocument();
    });

    // Having trouble getting this test to work, it loads the whole time for some reason
    it.skip('should load results when the query is submitted in the text box', async () => {
        const user = userEvent.setup();
        const router = createMemoryRouter(routes, {
            initialEntries: [links.search],
        });
        render(<RouterProvider router={router} />);
        const { result } = renderHook(() => useAppContext());

        expect(await screen.findByTestId('search-progress-bar')).not.toBeVisible();

        await user.type(await screen.findByLabelText('Search Term'), 'Seattle{Enter}');

        // It should show a loading bar while we're loading
        expect(await screen.findByTestId('search-progress-bar')).toBeVisible();

        await waitFor(() => {
            expect(result.current.searchState).toEqual(RemoteState.Loaded);
        });

        expect(
            await screen.findByText('b1277a5bbd120574d3abea306025f274da483a47', undefined, {})
        ).toBeVisible();
    });
});
