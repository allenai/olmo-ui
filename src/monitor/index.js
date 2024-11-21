/* eslint-disable */
// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START monitoring_synthetic_monitoring_custom_puppeteer_script]
const {
    instantiateAutoInstrumentation,
    runSyntheticHandler,
} = require('@google-cloud/synthetics-sdk-api');
// Run instantiateAutoInstrumentation before any other code runs, to get automatic logs and traces
instantiateAutoInstrumentation();
const functions = require('@google-cloud/functions-framework');
const axios = require('axios');

const puppeteer = require('puppeteer');

const assert = require('node:assert');

functions.http(
    'SyntheticFunction',
    runSyntheticHandler(async ({ logger, executionId }) => {
        /*
         * This function executes the synthetic code for testing purposes.
         * If the code runs without errors, the synthetic test is considered successful.
         * If an error is thrown during execution, the synthetic test is considered failed.
         */

        // Launch a headless Chrome browser and open a new page
        const browser = await puppeteer.launch({ headless: 'new', timeout: 0 });
        const page = await browser.newPage();

        // Navigate to the target URL
        const result = await page.goto('https://playground.allenai.org', { waitUntil: 'load' });

        // Confirm successful navigation
        await assert.equal(result.status(), 200);

        // Print the page title to the console
        const title = await page.title();
        logger.info(`My Page title: ${title} ` + executionId);

        try {
            // Wait for a <p> element containing the specified text to appear (up to 10 seconds)
            await page.waitForSelector('p', { timeout: 10000 });

            // Check if a <p> element with the exact text exists
            const textExists = await page.evaluate(() => {
            const paragraphs = Array.from(document.querySelectorAll('p'));
                return paragraphs.some(p => p.textContent.trim() === 'Ai2 Playground is a free scientific research and educational tool; always fact-check your results.');
            });

            // Assert that the text exists in a <p> element
            assert.strictEqual(textExists, true, 'The specified text should exist in a <p> element');
            console.log('Assertion passed: Text found in a <p> element');
        } catch (error) {
            console.error('Assertion error:', error.message);
            throw error;
        }
        // Close the browser
        await browser.close();
    })
);

// [END monitoring_synthetic_monitoring_custom_puppeteer_script]
