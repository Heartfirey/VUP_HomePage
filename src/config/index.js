import dev from './config.dev.js';
import prod from './config.prod.js';

const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default config;
