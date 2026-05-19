import dotenv from 'dotenv'; // reads the content of .env file and loads it in to the process.env
import path from 'path'; // safely manipulating the file and directory path(built-in)
import { fileURLToPath } from 'url'; // provide function to work on urls


/**
 * import.meta.url - gets the file URL
 * fileURLToPath(url) - converts url to absolute path(removes http:// or file://)
 * path.dirname(path) - extracts directory path(remove 'file.js' from filepath)
 * */ 
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

// path.resolve(path, instr), applies instr to the path
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});


if(!process.env.PORT) {
  throw new Error('PORT environment variable is not defined.')
}

if(!process.env.MONGO_URI) {
  throw new Error('MONGO_URI environment variable is not defined.')
}

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI
};

export default config;