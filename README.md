# olmo-ui

https://olmo.allen.ai

## Contributing

### Getting Started

If you'd like to have linting on commit, run `yarn run add-git-hooks`. This will use `husky` to set up our standard git hooks.

#### Forwarding the API

The UI depends on the [API](https://github.com/allenai/olmo-api). You'll need to forward a local port
to the production API to get things working.

> [!WARNING]
> Messages submitted locally will be persisted in the production database

1. Start by connecting to the Kubernetes cluster:

   ```
   gcloud container clusters get-credentials --project ai2-reviz --zone us-west1-b skiff-prod
   ```

   You might encounter this error message in your terminal: "CRITICAL: ACTION REQUIRED: gke-gcloud-auth-plugin, which is needed for continued use of kubectl, was not found or is not executable..."
   If it happens, install the plugin as it suggests with this command:

   ```
   gcloud components install gke-gcloud-auth-plugin
   ```

2. Then port forward `8000` to the API:

   ```
   kubectl port-forward -n olmo-api service/olmo-api-prod 8000
   ```

3. Next open another terminal and launch the application like so:

   ```
   docker compose up --build
   ```

### Running Tests

#### E2E Tests

To start running E2E tests follow the steps below:

- Copy the E2E_TEST_USER and E2E_TEST_PASSWORD to .env.local
  they can be found here: https://start.1password.com/open/i?a=DES74C5MCVDCTGGUDF3CJBUJC4&v=i2t3yrat34bj23pimhovzdorpu&i=wxfuwokc7qmolsjft2d7bsscuu&h=allenai.1password.com
- Set the AUTH0_CLIENT_ID and AUTH0_DOMAIN to point at our dev environment in .env.local
  ```
  AUTH0_CLIENT_ID=9AcX0KdTaiaz4CtonRRMIgsLi1uqP7Vd
  AUTH0_DOMAIN=allenai-public-dev.us.auth0.com
  ```
- Make sure mocking is enabled when running the dev server: `ENABLE_MOCKING=true docker compose up --build`
- Run `yarn test:e2e` to run all the e2e tests
- More commands: https://playwright.dev/docs/test-cli

To update e2e test screenshots for CI:

- `docker run --rm --network host -v $(pwd):/work/ -w /work/ -it mcr.microsoft.com/playwright:v{CURRENT_PLAYWRIGHT_VERSION}-focal /bin/bash`
- `yarn test:e2e --update-screenshots`

#### Unit Tests

To start running unit tests use the command belows:

- Run the command `yarn test` will perform a single run without watch node
- Run the command `yarn test:watch` will enter the watch mode in development environment and run mode in CI automatically
- More commands: https://vitest.dev/guide/cli

### Changing the Local User

By default the local user is `murphy@allenai.org`. To change the email of the logged in user,
set the `USER_EMAIL` environment variable when starting the application:

```
USER_EMAIL=grasshopper@allenai.org docker compose up --build
```

## Mocking network requests

We use MSW to mock network requests for testing and local development. To enable it, have `ENABLE_MOCKING=true` as an env variable when you're starting the server. If you're starting with `docker compose`, that would look like this: `ENABLE_MOCKING=true docker compose up --build`.

Mock request handlers can be found in `src/mocks/handlers`. If you want to add or modify a handler, check the MSW docs to learn more: https://mswjs.io/docs/basics/mocking-responses

## Setting up to use the Dolma API

    Generate a local config.json file:
    ```
    ./bin/bootstrap
    ```

## Importing SVGs as React components

We have SVGR set up in this project. To import an SVG as a Component, import it with `?react` at the end of the import filename. For example, `import CloseIcon from '@/components/assets/close.svg?react'` will import `close.svg` as a React component.

## Writing Tests

### Faking feature toggles

To fake feature toggles, you can pass a custom `featureToggles` into the second argument of `render`.
Example:

```
render(
   <FakeAppContextProvider>
         <ComponentToTest />
   </FakeAppContextProvider>,
   {
         wrapperProps: {
            featureToggles: {
               logToggles: false,
               isMultiModalEnabled: true,
            },
         },
   }
);
```

### Faking App Context state

To fake AppContext, you need to set up the `FakeAppContextProvider` and fake the implementation of `useAppContext` with `useFakeAppContext`.
Example:

```
vi.spyOn(RouterDom, 'useNavigation').mockReturnValue(IDLE_NAVIGATION);
vi.spyOn(AppContext, 'useAppContext').mockImplementation(useFakeAppContext);

render(
   <FakeAppContextProvider>
         <QueryForm />
   </FakeAppContextProvider>
)
```
