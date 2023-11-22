import { sleep } from "./utils";

export type PaginateCallback<T> = (
    limit: number,
    page: number,
) => Promise<{
    data: T[];
    total: number;
}>;

export async function paginate<T>(
    callback: PaginateCallback<T>,
    limit: number = 1000,
    coolDown: number = 400,
): Promise<T[]> {
    const res = [];
    let lastTotal = limit;
    let page = 1;

    while (lastTotal >= limit * page) {
        if (page > 1) await sleep(coolDown);
        const { data, total } = await callback(limit, page);
        console.log(data);
        lastTotal = total;
        res.push(...data);
        page++;
    }

    return res;
}
