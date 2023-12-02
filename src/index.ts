import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth/index.routes";
import usersRouter from "./routes/users/index.routes";

const app = express();

app.set("port", process.env.PORT || 3000);

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/users", usersRouter);

// Server listening
app.listen(app.get("port"), () => {
  console.log(`Server running on port: ${app.get("port")}`);
});
