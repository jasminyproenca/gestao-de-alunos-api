import request from 'supertest';
import app from '../app.js';
import 'dotenv/config';

export function api() {
    return request(app);
}