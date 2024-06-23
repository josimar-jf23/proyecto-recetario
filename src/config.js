import env from 'dotenv';
env.config();
export const PORT = process.env.NODE_PORT ?? 3000;