import { createApp } from './app.js';
import { env } from './config/env.js';

createApp().listen(env.port, () => {
  console.log(`ReservaClub backend escuchando en :${env.port}`);
});
