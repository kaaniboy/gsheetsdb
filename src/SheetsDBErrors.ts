type QueryError = {
    query: string;
    error: string;
};

export function queryError(
    message: string,
    query: string,
    debugMode = false
): QueryError {
    if (debugMode) {
        console.error(query + '\n' + message);
    }
    return {
        query: query,
        error: message
    };
}