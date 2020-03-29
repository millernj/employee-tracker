const util = require('util');
const connection = require('./connection');

const asyncQuery = (sql, args) => util.promisify(connection.query).call(connection, sql, args);
const asyncConnection = () => util.promisify(connection.connect).call(connection);

module.exports = {
  connect: async () => {
    try {
      await asyncConnection();
      console.log("connected as id " + connection.threadId);
    } catch (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
  },

  deleteById: async (table, id) => {
    let sql = `DELETE FROM ${table} WHERE id = ?`

    return await asyncQuery(sql, id);
  },

  insert: async (table, document) => {
    let sql = `INSERT INTO ${table} SET ?`;

    return await asyncQuery(sql, document);
  },

  select: async (table, columns=['*'], clauses=['']) => {
    let sql = `SELECT ${columns.join(',')} FROM ${table}`;

    clauses.forEach((clause) => {
      sql += ' ' + clause;
    });

    return await asyncQuery(sql);
  },

  updateById: async (table, id, update) => {
    let sql = `UPDATE ${table} SET ? WHERE id = ?`;

    return await asyncQuery(sql, [update, id]);
  }
}