import * as express from 'express'
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as http from 'http';
import * as dotenv from 'dotenv';
import * as sockio from 'socket.io';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT ?? 4000;
const server = http.createServer(app);
app.use(morgan('dev'));
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "30mb" }));
app.use(express.static("public"));

app.get("/", (req: express.Request, res: express.Response) => {
	res.send("Hello World!!!!");
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT} OnOn`);
});

const io = sockio.listen(server, { 'destroy buffer size': Infinity })