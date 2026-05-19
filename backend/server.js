import app from './src/app.js';
import config from './src/configs/config.config.js';
import connectDB from './src/configs/mongoose.config.js';

connectDB();

app.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
})
