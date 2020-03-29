const util = require('util');
const connection = require('./connection');

const asyncQuery = (sql, args) => util.promisify(connection.query).call(connection, sql, args);
const asyncConnection = () => util.promisify(connection.connect).call(connection);

module.exports = {
  select: async (table, columns=['*'], clauses=['']) => {
    let sql = `SELECT ${columns.join(',')} FROM ${table}`;

    clauses.forEach((clause) => {
      sql += ' ' + clause;
    });

    return await asyncQuery(sql);
  },
  connect: async () => {
    try {
      await asyncConnection();
      console.log("connected as id " + connection.threadId);
    } catch (err) {
      console.error("error connecting: " + err.stack);
      return;
    }
  }
}