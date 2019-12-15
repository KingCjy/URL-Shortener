import * as mysql from 'mysql';
import { Resolver } from 'dns';

export function getConnection () {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jpa'
  });
}

export async function query (connection, query, args) {
  return new Promise(resolve => {
    connection.query(query, args, (error, result) => {
      if (error) {
        console.error(error);
      }
      resolve(result);
    });
  });
}

export async function selectOne (connection, query, args) {
  return new Promise(resolve => {
    connection.query(query, args, (error, result) => {
      if (error) {
        console.error(error);
      }
      resolve(result[0]);
    });
  });
}

export async function insert (connection, query, args) {
  return new Promise(resolve => {
    connection.query(query, args, (error, result) => {
      if (error) {
        console.error(error);
      }
      resolve(result.insertId);
    });
  });
}
