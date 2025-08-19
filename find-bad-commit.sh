#!/bin/bash

yarn install

npx vitest run --project=storybook

e=$?

exit $e