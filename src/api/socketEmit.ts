import type {Socket} from "socket.io-client";

export type EmitResult<T> =
    | {
    ok: true;
    data: T;
}
    | {
    ok: false;
    error: string;
};

type ErrorResponse = {
    error: string;
};

const isErrorResponse = (value: unknown): value is ErrorResponse => {
    return (
        typeof value === "object" &&
        value !== null &&
        "error" in value &&
        typeof value.error === "string"
    );
};

export async function emit<T>(
    socket: Socket | undefined,
    event: string,
    payload?: unknown
): Promise<EmitResult<T>> {
    if (!socket) {
        return {
            ok: false,
            error: "Socket is not initialized"
        };
    }

    try {
        const res =
            payload === undefined
                ? await socket.emitWithAck(event)
                : await socket.emitWithAck(event, payload);

        if (isErrorResponse(res)) {
            return {
                ok: false,
                error: res.error
            };
        }

        return {
            ok: true,
            data: res as T
        };
    } catch (e) {
        return {
            ok: false,
            error: e instanceof Error ? e.message : "Unknown socket error"
        };
    }
}