import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://punithhkp960_db_user:Puni123588998@sample.cr7iq0n.mongodb.net/?appName=Sample";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise!;

export default clientPromise;