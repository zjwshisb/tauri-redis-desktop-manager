export function getPageKey(name: string, conn: APP.Connection, db: number) {
    return `${name}|${conn.host}:${conn.port}@${db}`
};
