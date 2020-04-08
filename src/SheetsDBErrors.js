export function queryError(message, query, debugMode) {
    if (debugMode) {
        console.error(query + '\n' + message);
    }
    return {
        query: query,
        error: message
    };
}