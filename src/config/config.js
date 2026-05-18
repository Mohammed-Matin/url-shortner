import dotenv from 'dotenv';

dotenv.config();

if(!process.env.PORT) {
  throw new Error('PORT environment variable is not defined.')
}

const config = {
  PORT: process.env.PORT
};

export default config;