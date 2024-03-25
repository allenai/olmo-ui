# olmo-ui

https://olmo.allen.ai

## Contributing

## Github setup
Olmo-Ui repo requires verify commit so it won't allow you to merge. If you run into the issue, here is the step below that you need to do to set it up
Disclaimer: below is the instruction on how to set up verify commit using gpg please refer to docs for ssh-specific info(https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key#telling-git-about-your-ssh-key)
1. Install gnupg
    ```
    brew install gnupg           
    ```
2. Generate gpg key
    ```
    gpg --full-generate-key
    ```
3. If you have previously configured Git to use a different key format when signing with --gpg-sign, unset this configuration so the default format of openpgp will be used.
    ```
    git config --global --unset gpg.format
    ```
4. Use the gpg --list-secret-keys --keyid-format=long command to list the long form of the GPG keys for which you have both a public and private key. A private key is required for signing commits or tags.
    The signingkey is after sec: rsa/
    ```
    gpg --list-secret-keys --keyid-format=long
    ```
5. To set your primary GPG signing key in Git, paste the text below, substituting in the GPG primary key ID you'd like to use.
    ```
    git config --global user.signingkey signingkey
    ```
6. Go to https://github.com/settings/profile and click on SSH and GPG keys, select GPG Keys and add your public GPG keys in there. To retrieve your public GPG keys use the command below.
    The GPG public key started with -----BEGIN PGP PUBLIC KEY BLOCK-----
    ```
    gpg --armor --export signingkey 
    ```
7. After export and save your key in github on terminal following these step:
    ```
    echo $SHELL
    ```
    Once you use the command above to find out your SHELL type add this export to it
    ```
    export GPG_TTY=$(tty)
    ```
### Getting Started

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
To start running E2E tests following the steps below:
- Navigate `e2e` folder
- Run the command below `yarn test:e2e` to run all the e2e tests
- More commands: https://playwright.dev/docs/test-cli

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
We use MSW to mock network requests. To enable it, add `ENABLE_MOCKING: true` to the `env` for `ui` in `docker-compose.yaml`. Mock request handlers can be found in `src/mocks/handlers`. If you want to add or modify a handler, check the MSW docs to learn more: https://mswjs.io/docs/basics/mocking-responses