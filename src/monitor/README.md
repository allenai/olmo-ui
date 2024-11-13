## Getting started
1. Modify the code in monitor folder.
2. Shut down olmo-ui since the command below run on port 8080.
3. Run the command below:
    ```
        npx functions-framework --target=SyntheticFunction
    ```
4. Navigate to the localhost:8080 if you see json object with synthetic_generic_result_v1 oke true you are good.
4. Raise PR for review.
5. Once PR gets approval please merge the PR and run the command:
    ```
        gcloud functions deploy  Ai2-Playground-Monitor --gen2 --runtime=nodejs20 --region=us-west1 --source=. --entry-point=SyntheticFunction --memory=2G --timeout=60 --trigger-http
    ```
## Helpful Links
Monitor: https://console.cloud.google.com/monitoring/synthetic-monitoring/ai2-playground-monitor-v-l612mGeME;duration=PT15M?project=ai2-reviz
Cloud Run Functions: https://console.cloud.google.com/functions/details/us-west1/Ai2-Playground-Monitor?env=gen2&project=ai2-reviz