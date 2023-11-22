import { version, description } from "../package.json";
import { env, argv } from "node:process";
import { errorExit } from "./utils";
import { program } from "commander";

program
    .name("sb-i18n")
    .description(description)
    .version(version)
    .option(
        "-t, --token <token>",
        "storyblok access token",
        env.SB_ACCESS_TOKEN,
    )
    .option("-r, --region <region>", "storyblok region", env.SB_REGION)
    .option("-d, --datasource <slug>", "slug of the target datasource")
    .option("-l, --default-lang <lang>", "lang of the default dimension")
    .option("-o, --outfile <path>", "filename of the JSON output", "i18n.json")
    .option(
        "--limit <count>",
        "max results per storyblok API requests",
        parseInt,
        1000,
    )
    .option(
        "--cool-down <ms>",
        "time to wait between paginations",
        parseInt,
        400,
    )
    .option("--spacing <count>", "JSON format spacing", parseInt, 4)
    .option("-s, --silent", "verbose setting", false);

program.parse(argv);
const options = program.opts();

if (!options.token) errorExit("Missing --token or $SB_ACCESS_TOKEN");
if (!options.region) errorExit("Missing --region or $SB_REGION");
if (!options.datasource) errorExit("Missing --datasource");
if (!options.defaultLang) errorExit("Missing --default-lang");

export { options };
