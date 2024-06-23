import {config} from 'dotenv';
config();
export const PORT = process.env.NODE_PORT ?? 3000;