import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import http from "http";
import pinoHttp from "pino-http";
import { WebSocketServer } from "ws";
import { config } from "./config";
import { requireAuth } from "./middleware/auth";
import { signCsrfToken } from "./lib/csrfToken";
import { errorHandler, notFoundHandler } from "./middleware/error";
import { verifyAccessToken } from "./lib/jwt";
import { authRouter } from "./routes/auth";
import { adminRouter } from "./routes/admin";
import { categoriesRouter } from "./routes/categories";
import { conversationsRouter } from "./routes/conversations";
import { favoritesRouter } from "./routes/favorites";
import { listingsRouter } from "./routes/listings";
import { notificationsRouter } from "./routes/notifications";
import { offersRouter } from "./routes/offers";
import { ordersRouter } from "./routes/orders";
import { profilesRouter } from "./routes/profiles";
import { reportsRouter } from "./routes/reports";
import { sellersRouter } from "./routes/sellers";
import { supportRouter } from "./routes/support";
import { uploadsRouter } from "./routes/uploads";
import { notificationHub } from "./ws/hub";
import { bootstrapFirstAdmin } from "./lib/bootstrapAdmin";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = config.frontendOrigins;
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowed.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(pinoHttp());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/csrf", (_req, res) => res.json({ csrfToken: signCsrfToken() }));

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/categories", categoriesRouter);
app.use("/profiles", profilesRouter);
app.use("/listings", listingsRouter);
app.use("/favorites", favoritesRouter);
app.use("/offers", offersRouter);
app.use("/conversations", conversationsRouter);
app.use("/notifications", notificationsRouter);
app.use("/reports", reportsRouter);
app.use("/uploads", uploadsRouter);
app.use("/orders", ordersRouter);
app.use("/sellers", sellersRouter);
app.use("/support", supportRouter);

app.get("/me", requireAuth, async (req, res) => {
  res.json({ userId: req.auth!.userId, role: req.auth!.role });
});

app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (socket, req) => {
  const reqUrl = new URL(req.url || "", `http://${req.headers.host}`);
  const token = reqUrl.searchParams.get("access_token");
  if (!token) {
    socket.close(1008, "Missing access token");
    return;
  }
  let userId = "";
  try {
    const decoded = verifyAccessToken(token);
    userId = decoded.sub;
  } catch {
    socket.close(1008, "Invalid token");
    return;
  }

  const unsubscribe = notificationHub.subscribe(userId, (payload) => {
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(payload));
    }
  });

  socket.on("close", () => {
    unsubscribe();
  });
});

void (async () => {
  try {
    await bootstrapFirstAdmin();
  } catch (err) {
    console.error("[bootstrap] failed:", err);
  }
  server.listen(config.port, () => {
    console.log(`API listening on http://localhost:${config.port}`);
  });
})();
