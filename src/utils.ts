import type { OptionValues } from "commander";
import chalk, { ColorName } from "chalk";
import { exit } from "node:process";

export function errorExit(message: string, code: number = 1) {
    logger({}, message, "red", "error");
    return exit(code);
}

export function logger(
    options: OptionValues,
    message: string,
    color: ColorName = "blueBright",
    level: "log" | "info" | "warn" | "error" = "info",
) {
    if (options.silent) return;
    console[level](
        chalk.grey(level.toUpperCase() + ":"),
        chalk[color](message),
    );
}
