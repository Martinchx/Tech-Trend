import app from './app.js';
import { PORT } from './utils/config.js'
import './utils/db.js';

app.listen(PORT);
console.log(`Server on port ${PORT}`);