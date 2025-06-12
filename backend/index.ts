import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const cors = require('cors');
app.use(cors());
app.use(express.json());
const db = require('../db');

app.get('/cities', (request: Request, response: Response) => {
  const { uuid, name, minimalCount, maximalCount, page } = request.query;
  let whereClause = [];
  let parameters = [];
  if (uuid) {
    whereClause.push("uuid = ?");
    parameters.push(uuid);
  }
  if (name) {
    whereClause.push("cityName LIKE ?");
    parameters.push(`%${name}%`);
  }
  const minCountNum = Number(minimalCount);
  const maxCountNum = Number(maximalCount);
  if (!isNaN(minCountNum)) {
    whereClause.push("count >= ?");
    parameters.push(minCountNum);
  }
  if (!isNaN(maxCountNum)) {
    whereClause.push("count <= ?");
    parameters.push(maxCountNum);
  }
  const sql = "SELECT uuid, cityName AS name, count FROM cities" + (whereClause.length ? " WHERE " + whereClause.join(" AND ") : "");
  db.all(sql, parameters, (err: Error | null, rows: any[]) => {
    if (err) {
      return response.status(500).json({ Error: err.message });
    }
    const pageSize = 5;
    const pageNum = Number(page) || 1;
    const start = (pageNum - 1) * pageSize;
    const paged = rows.slice(start, start + pageSize);
    response.json(paged);
  });
});

app.post('/cities', (request: Request, response: Response) => {
  const { uuid, name, count } = request.body;
  if (!uuid || !name || typeof count !== 'number') {
    return response.status(400).send('Missing or invalid parameters');
  }
  const statement = db.prepare("INSERT INTO cities (uuid, cityname, count) VALUES (?, ?, ?)");
  statement.run(uuid, name, count, (err: Error | null) => {
    if (err) {
      return response.status(500).send('Failed to insert city');
    }
    statement.finalize((finalizeErr: Error | null) => {
      if (finalizeErr) {
        return response.status(500).send('Failed to finalize statement');
      }
      response.json({ message: `City ${name} inserted successfully` });
    });
  });
});

app.put('/cities/:uuid', (request, response) => {
  const { name, count } = request.body;
  const uuid = request.params.uuid;
  const statement = db.prepare(
    "UPDATE cities SET cityname = ?, count = ? WHERE uuid = ?"
  );
  statement.run(
    name,
    count,
    uuid,
    function (this: { changes: number }, err: Error | null) {
      if (err) {
        return response.status(500).send('Failed to update city');
      }
      if (this.changes === 0) {
        return response.status(404).send(`No city was found with uuid: ${uuid}`);
      }
      response.send({ message: `City with uuid ${uuid} updated successfully` });
    }
  );
  statement.finalize();
});

app.delete('/cities/:uuid', (request, response) => {
  const { uuid } = request.params;
  if (!uuid) {
    return response.status(400).send('UUID parameter is required');
  }
  const sql = 'DELETE FROM cities WHERE uuid = ?';
  db.run(sql, [uuid], function (this: { changes: number }, err: Error) {
    if (err) {
      return response.status(500).send('Failed to delete city');
    }
    if (this.changes === 0) {
      return response.status(404).send('City not found');
    }
    response.send(`{"message" : "City with uuid ${uuid} deleted successfully"}`);
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});