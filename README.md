# olmo-ui

https://olmo.allen.ai

## Contributing

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

### Changing the Local User

By default the local user is `murphy@allenai.org`. To change the email of the logged in user,
set the `USER_EMAIL` environment variable when starting the application:

```
USER_EMAIL=grasshopper@allenai.org docker compose up --build
```
