import type {Socket} from "socket.io-client";

export async function emit<T>(
    socket: Socket | undefined,
    event: string,
    payload?: unknown
): Promise<T | null> {
    if (!socket) {
        return null;
    }

    try {
        const res =
            payload === undefined
                ? await socket.emitWithAck(event)
                : await socket.emitWithAck(event, payload);

        if (res && typeof res === "object" && "error" in res) {
            console.warn(res.error);
            return null;
        }

        return res as T;
    } catch (e) {
        console.error(e);
        return null;
    }
}