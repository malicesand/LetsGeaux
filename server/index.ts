import { urlencoded } from "express";
const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

const DIST_DIR = path.resolve(__dirname, 'dist');
const port = 8000;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(express.urlencoded({ extended: true }));


app.get('*', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
})
app.listen(port, () => {
  console.log(`Let's Geaux listening @ http://localhost:${port}`)
});
