import type { OptionValues } from "commander";
import chalk, { ColorName } from "chalk";
import { exit } from "node:process";

export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function errorExit(message: string, code: number = 1): never {
    logger({}, message, "red", "error");
    exit(code);
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
