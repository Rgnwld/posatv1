// const http = require('http')
import http from 'http';
import sqlite3 from "sqlite3";
import { ExecuteSQL } from "./sql.js";
import { randomUUID } from "node:crypto";


const dbname = 'test.db';

const db = new sqlite3.Database(dbname);

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer( async (req, res) => {
    switch (req.url) {
        case '/':
            res.statusCode = 200;
            res.end("Hello World");
            break;
        case '/User':
            if(req.method == `POST`){
                let body = '';

                req.on('data', (chunk) => {
                    body += chunk;
                });

                req.on('end', async () => {
                    const userOBJ = JSON.parse(body);
                    await InsertUser(userOBJ.name, userOBJ.pwd);
                    res.write('OK'); 
                    res.end(); 
                });
            }

            if(req.method == `GET`){
                res.statusCode = 200;
                
                res.end("Hello User");
            }

            break;
        case '/CreateDB':
            await CreateDB();
            res.end('DB created');
            break;
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})

async function CreateDB() {
    try {
        await ExecuteSQL(
            db,
            `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        pwd TEXT NOT NULL)`
        );
    } catch (error) {
        console.log(error);
    } finally {
        db.close();
    }
};

async function InsertUser(username, pwd) {
    try {
        await ExecuteSQL(
            db,
            `INSERT INTO users (name, pwd) VALUES ('${username}', '${pwd}')`
        );
    } catch (error) {
        console.log(error);
    } finally {
        db.close();
    }
};



