# sb-datasource-to-i18n-json

> Export i18n JSON from Storyblok dimensioned datasources.

[![wakatime](https://wakatime.com/badge/github/mathix420/sb-datasource-to-i18n-json.svg)](https://wakatime.com/badge/github/mathix420/sb-datasource-to-i18n-json) [![npm version](https://badge.fury.io/js/sb-datasource-to-i18n-json.svg)](https://badge.fury.io/js/sb-datasource-to-i18n-json)

Useful for utilizing existing i18n integrations on a frontend framework instead of fetching from the Storyblok API.

Designed for a [nuxt-i18n](https://i18n.nuxtjs.org/) use case, but it's framework-agnostic.

As I have set up Vercel deployment webhooks on my Storyblok instance, every time the datasource is updated and saved, a new deployment will be performed, reflecting the changes.


## Usage guide

### Install

```bash
# npm
npm i -D sb-datasource-to-i18n-json
# bun
bun i -D sb-datasource-to-i18n-json
# pnpm
pnpm i -D sb-datasource-to-i18n-json
# yarn
yarn add -D sb-datasource-to-i18n-json
```

### Run

```bash
npx sb-i18n --help
# OR
bunx sb-i18n --help
```

### Integrate

In your `package.json`:
```json
{
    "scripts": {
        // To trigger on every npm i (usefull for CI jobs)
        "prepare": "sb-i18n -r eu -t TO_REPLACE -d DATASOURCE_NAME -l fr",
        // OR
        "sync-i18n": "sb-i18n -r eu -t TO_REPLACE -d DATASOURCE_NAME -l fr",
    }
}
```

Then run
```bash
npm i
# OR
npm run sync-i18n
```

## Requirements

For this script to work, you need to setup a datasource following these rules:

- Do not create a dimension for the default language.
- Create a dimension for each language you want a translation:
    - For the name of the dimension put everything you want (ex: `German`).
    - For the value of the dimension, you need to respect the value your put in your i18n config (ex: `de`).
- Remember the Slug/ID when creating a datasource (or see it in settings) as it correspond to the `-d, --datasource <slug>` parameter.

## Dev guide

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

This project was created using `bun init`. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
