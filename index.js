require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors())
app.use(express.json());

const routes = require('./routes/routes');
const {initializeApp, cert} = require("firebase-admin/app");

app.listen(3001, () => {
    console.log(`Server Started at ${3001}`)
})

app.use('/api/v1', routes);

try {
    const serviceAccount = process.env.FIREBASE_KEY;
  const firebaseINit = initializeApp({
        credential: cert(serviceAccount),
        databaseURL: "https://devfest-nagpur-602ab-default-rtdb.firebaseio.com/"
    });
console.log(firebaseINit)

} catch (e) {
    console.log(e)
}