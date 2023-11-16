import { storyblokInit, apiPlugin } from "@storyblok/js";
import { errorExit, logger } from "./utils";
import { writeFileSync } from "node:fs";
import { options } from "./args";

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
const {
    data: { datasource },
} = await storyblokApi.get(`cdn/datasources/${options.datasource}`, {
    version: "draft",
});

// Extract all languages/dimensions
const langs = datasource.dimensions.map((x) => x.entry_value);

// Log found languages
const foundLangs = [options.defaultLang, ...langs].join(", ");
l(`Discovered ${langs.length + 1} langs: ${foundLangs}.`);

// Create i18n JSON dict
const result: Record<string, Record<string, string>> = {
    [options.defaultLang]: {},
    ...Object.fromEntries(langs.map((x) => [x, {}])),
};

// Fill the dict with translations
for (const lang of langs) {
    l(`Fetching "${lang}" entries.`);

    const {
        data: { datasource_entries },
    } = await storyblokApi.get("cdn/datasource_entries", {
        version: "draft",
        datasource: options.datasource,
        dimension: lang,
        per_page: 1000,
    });
    // TODO: paginate

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
