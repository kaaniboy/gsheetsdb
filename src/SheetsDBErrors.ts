export function queryError(
    message: string,
    query: string,
    debugMode = false
) {
    if (debugMode) {
        console.error(query + '\n' + message);
    }
    return {
        query: query,
        error: message
    };
}