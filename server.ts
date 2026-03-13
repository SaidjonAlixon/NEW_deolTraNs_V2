import 'dotenv/config';
import { app } from './api/applications.ts';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Local API server running on http://localhost:${PORT}`);
});

