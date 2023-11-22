import { storyblokInit, apiPlugin } from "@storyblok/js";
import type { ISbDimensions } from "@storyblok/js";
import { errorExit, logger } from "./utils";
import { writeFileSync } from "node:fs";
import { paginate } from "./paginate";
import { options } from "./args";

export type DatasourceEntry = {
    id: number;
    name: string;
    value: string;
    dimension_value: string | null;
};

export type I18nEntries = Record<string, Record<string, string | null>>;

// Init logger with options
const l = logger.bind(null, options);

// Init Storyblok API
const { storyblokApi } = storyblokInit({
    apiOptions: { region: options.region },
    accessToken: options.token,
    use: [apiPlugin],
});

// Handle Storyblok API init error
if (!storyblokApi) errorExit("Failed to init API.");

// List datasource's dimensions
const { data } = await storyblokApi.get(
    `cdn/datasources/${options.datasource}`,
    {
        version: "draft",
    },
);

if (!data?.datasource) errorExit("Can't find datasource.");

// Extract all languages/dimensions
const datasource: ISbDimensions = data.datasource;
const langs = datasource.dimensions.map((x) => x.entry_value);

// Log found languages
const foundLangs = [options.defaultLang, ...langs].join(", ");
l(`Discovered ${langs.length + 1} langs: ${foundLangs}.`);

// Create i18n JSON dict
const result: I18nEntries = {
    [options.defaultLang]: {},
    ...Object.fromEntries(langs.map((x) => [x, {}])),
};

// Fill the dict with translations
for (const lang of langs) {
    l(`Fetching "${lang}" entries.`);

    const datasource_entries = await paginate<DatasourceEntry>(
        (per_page, page) =>
            storyblokApi
                .get("cdn/datasource_entries", {
                    version: "draft",
                    datasource: options.datasource,
                    dimension: lang,
                    per_page,
                    page,
                })
                .then((res) => ({
                    data: res.data.datasource_entries,
                    total: res.total,
                })),
        options.limit,
        options.coolDown,
    );

    for (const entry of datasource_entries) {
        // Instead of doing a different api call to get default lang,
        // it will get filled alongside the first dimension
        if (!(entry.name in result[options.defaultLang])) {
            result[options.defaultLang][entry.name] = entry.value;
        }
        result[lang][entry.name] = entry.dimension_value;
    }
}

// Save the JSON output
writeFileSync(
    options.outfile,
    JSON.stringify(result, undefined, options.spacing),
);
