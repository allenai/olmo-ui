# olmo-ui

https://olmo.allen.ai

## Contributing

### Getting Started

If you'd like to have linting on commit, run `yarn run add-git-hooks`. This will use `husky` to set up our standard git hooks.

### Local Development (without Docker)

For the fastest and simplest development experience, you can run the application locally while connected to production APIs:

Settings for running dev server against prod apis:

- recaptcha should be enabled by adding `IS_RECAPTCHA_ENABLED=true` in your .env.local
- you should remove `LOCAL_PLAYGROUND_API_URL` from your .env.local
- you must logged in, otherwise you will get an error in the ui

Settings for running against olmo-api running locally:

- recaptcha should be disabled by removing `IS_RECAPTCHA_ENABLED` from your .env.local
- you should set `LOCAL_PLAYGROUND_API_URL=http://localhost:8000` in your .env.local to connect to the local olmo-api

```
yarn dev
```

This command:

- Starts the development server on `http://localhost:8080`
- Connects directly to production APIs
- Provides hot reload for development

#### Running Locally With Docker

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

E2E tests use automated scripts that handle environment variable configuration, so you don't need to manually switch settings when moving between regular development and E2E testing.

**Setup:**

Add the E2E test credentials to your `.env.local`:

```
E2E_TEST_USER=playground-e2e-test@allenai.org
E2E_TEST_PASSWORD=[get from 1Password]
```

The `E2E_TEST_PASSWORD` can be found in 1Password: https://start.1password.com/open/i?a=DES74C5MCVDCTGGUDF3CJBUJC4&v=i2t3yrat34bj23pimhovzdorpu&i=wxfuwokc7qmolsjft2d7bsscuu&h=allenai.1password.com

**Running E2E tests:**

1. Start the E2E development server:

   ```
   yarn test:e2e:server
   ```

2. Run the tests (in a separate terminal):

   ```
   yarn test:e2e:local:chromium  # Run only Chromium tests
   yarn test:e2e:local           # Run all browser tests
   ```

3. Run an individual test file:
   ```
   yarn test:e2e:local:chromium e2e/olmo.spec.ts
   ```

The scripts automatically configure all necessary environment variables for E2E testing (mocking, Auth0 dev environment, feature flags, etc.).

More Playwright commands: https://playwright.dev/docs/test-cli

**To update e2e test screenshots for CI:**

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

### Testing HEAP events on local

Switch to `local` environment on HEAP Analytics, then have `IS_ANALYTICS_ENABLED=true` and set `HEAP_ANALYTICS_ID` to the Heap ID of the `local` environment in your `.env.local`. You will see your local events showing on HEAP dashboard.
