import app from './src/app.js';
import config from './src/config/config.config.js';
import connectDB from './src/config/mongoose.config.js';

connectDB();

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
})
