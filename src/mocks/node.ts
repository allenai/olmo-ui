import { setupServer } from 'msw/node';

import { handlers } from './handlers';

export const server = setupServer(...handlers);
server.events.on('request:start', ({ request }) => {
    console.log('Handling:', request.method, request.url);
});

server.events.on('newListener', (listen) => {
    console.log('foo', listen);
});
