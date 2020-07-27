require("dotenv").config();
import { GraphQLServer } from "graphql-yoga";
import { permissions } from "./permissions";
import { schema } from "./schema";
import { createContext } from "./context";
import logger from "morgan";

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [permissions],
});
server.express.use(logger("dev"));
server.start({ port: PORT }, () => {
  console.log(`🚀 Server ready at: http://localhost:${PORT}`);
});
