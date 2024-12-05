import { createClient } from '@libsql/client';

const client = createClient({
    // In production, use Turso URL and auth token
    url: process.env.TURSO_DATABASE_URL || 'file:dentist_office.db',
    authToken: process.env.TURSO_AUTH_TOKEN
});

export async function query(sql, params = []) {
    try {
        const result = await client.execute({ sql, args: params });
        return result.rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

export async function execute(sql, params = []) {
    try {
        const result = await client.execute({ sql, args: params });
        return result;
    } catch (error) {
        console.error('Database execute error:', error);
        throw error;
    }
} 