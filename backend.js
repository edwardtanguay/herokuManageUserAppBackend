import express from 'express';
import mongodb, { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 3016;
dotenv.config();
const mongoConnectString = process.env.MONGODB_URI;
const client = new MongoClient(mongoConnectString);

const sessionIds = [];
let sessionId = 0;

const debug = () => {
	console.log('sessionId: ' + sessionId);
	console.log('sessionIds: ' + sessionIds.join('|'));
}

const uriIsAllowed = function (req, res, next) {
	const referer = req.headers.referer;
	const host = `http://${req.headers.host}`;
	let frontendUri = referer;
	if (frontendUri === undefined) {
		frontendUri = host;
	}
	if (frontendUri === undefined || !frontendUri.startsWith(process.env.ALLOWED_FRONTEND_URI)) {
		res.status(403).send('access from this uri is not allowed');
	} else {
		next();
	}
}

const adminIsLoggedIn = (req, res) => {
	res.status(401).send('admin access required');
	return false;
}

app.use(cookieParser());
app.use(uriIsAllowed);
app.use(cors());
app.use(express.json());

const execMongo = async (done) => {
	await client.connect();
	const db = client.db('api001');
	done(db);
}

app.get('/login', (req, res) => {
	if (!req.cookies.sessionId) {
		sessionId = Math.floor(Math.random() * 100000000000);
		sessionIds.push(sessionId);
		debug();
		res.cookie('sessionId', sessionId, { maxAge: 9000000000 });
		res.json({
			response: 'ok'
		});
	} else {
		debug();
		res.json({
			response: 'you are already logged in'
		});
	}
});

app.get('/logout', (req, res) => {
	sessionId = 0;
	debug();
	res.clearCookie('sessionId');
	res.json({
		response: 'you are now logged out'
	});
});

app.get('/', (req, res) => {
	execMongo(async (db) => {
		const users = await db.collection('users100').find()
			.project({
				name: 1,
				username: 1,
				email: 1
			}).toArray();
		res.json(users);
	});
});

app.delete('/deleteuser/:id', (req, res) => {
	if (adminIsLoggedIn(req, res)) {
		const id = req.params.id;
		execMongo(async (db) => {
			const deleteResult = await db.collection('users100').deleteOne({ _id: new mongodb.ObjectId(id) });
			res.json({
				result: deleteResult
			});
		});
	}
});

app.post('/insertuser', (req, res) => {
	if (adminIsLoggedIn(req, res)) {
		const user = req.body.user;
		execMongo(async (db) => {
			const insertResult = await db.collection('users100').insertOne(user);
			res.json({
				result: insertResult
			});
		});
	}
});

app.patch('/edituseremail/:id', (req, res) => {
	if (adminIsLoggedIn(req, res)) {
		const id = req.params.id;
		const email = req.body.email;
		res.json({
			id,
			email
		});
		execMongo(async (db) => {
			const updateResult = await db.collection('users100').updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { email } });
			res.json({
				result: updateResult
			});
		});
	}
});

app.listen(port, () => {
	console.log(`listening on http://localhost:${port}`);
});