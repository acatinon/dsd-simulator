export interface Epoch {
    number: string;
    priceCumulative: string;
    timestamp: number
}

export async function getEpoch(): Promise<Epoch> {
    const epochResponse = await fetch("/epoch.json");
    const epoch = await epochResponse.json();

    return epoch as Epoch;
}