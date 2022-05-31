import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const app = express();

app.get("/", (req, res) => {
    let status = 200;
    let retVal = {};
    retVal.message = `Hola!`;
    retVal.status = status;
    res.status(status).json(retVal);
});

app.get("/characters", async (req, res) => {
    let status = 200;
    let retVal = {};

    try {
        const query = "SELECT * FROM hp_character";
        const [rows] = await connection.query(query);
        retVal.data = rows;
    } catch (err) {
        console.error(err);
        retVal.error = "Algo salió mal";
        status = 500;
    } finally {
        retVal.status = status;
        res.status(status).json(retVal);
    }
});

app.get("/characters/:id", async (req, res) => {
    let status = 200;
    let retVal = {};
    const { id } = req.params;
    
    if (isNaN(id)) {
        status = 400;
        retVal.message =
        "Solicitud no válida. Asegúrese de que la identificación que está buscando sea un número";
        retVal.status = status;
        return res.status(status).json(retVal);
    }

    try {
        const query = "SELECT * FROM hp_character WHERE id = ?";
        const [rows] = await connection.query(query, [id]);

        retVal.data = rows[0];
        if (!retVal.data) {
            status = 404;
            retVal.message = `No se encontró ningún registro con el ID especificado: ${id} :(`;
        }
    } catch (err) {
        console.error(err);
        retVal.error = "Algo salió mal";
        status = 500;
    } finally {
        retVal.status = status;
        res.status(status).json(retVal);
    }
});

app.get("/wands", async (req, res) => {
    let status = 200;
    let retVal = {};

    try {
        const query = "SELECT * FROM wand";
        const [rows] = await connection.query(query);
        retVal.data = rows;
    } catch (error) {
        console.error(error);
        retVal.error = "Algo salió mal";
        status = 500;
    } finally {
        retVal.status = status;
        res.status(status).json(retVal);
    }
});

app.get("/wands/:id", async (req, res) => {
    let status = 200;
    let retVal = {};
    const { id } = req.params;
    
    if (isNaN(id)) {
        status = 400;
        retVal.message =
        "Solicitud no válida. Asegúrese de que la identificación que está buscando sea un número";
        retVal.status = status;
        return res.status(status).json(retVal);
    }

    try {
        const query = `SELECT * FROM wand WHERE wand.id=?`;
        const [rows] = await connection.query(query, [id]);

        retVal.data = rows[0];
        if (!retVal.data) {
            status = 404;
            retVal.message = `No se encontró ningún registro con el ID especificado: ${id} :(`;
        }
    } catch (error) {
        console.error(error);
        retVal.error = "Algo salió mal";
        status = 500;
    }finally{
        res.status(status).json(retVal);
    }
});

app.listen(3001, () => {
    console.log(`La app esta corriendo en el puerto 3001`);
});
