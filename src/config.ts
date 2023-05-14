import * as dotenv from "dotenv";
dotenv.config();

export interface IConfig {
  mjProxyEndpoint: string;
  blockWords: string[]
}

export const config: IConfig = {
  mjProxyEndpoint: process.env.MJ_PROXY_ENDPOINT || "http://47.236.20.243:8080/mj/",
  blockWords: process.env.BLOCK_WORDS?.split(",") || []
};
