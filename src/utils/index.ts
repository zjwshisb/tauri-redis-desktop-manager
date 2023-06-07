export function getPageKey(name: string, conn: APP.Connection, db?: number) {
    let key = `${name}|${conn.host}:${conn.port}`
    if (db !== undefined) {
        key += `@${db}`
    }
    return key
};
