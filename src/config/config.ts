import {config as conf} from "dotenv";
conf();


const _config={
      port : process.env.PORT,
      databaseUrl:process.env.MONGO_CONNECTION_STRING,
};


//read only
export const config=Object.freeze(_config);