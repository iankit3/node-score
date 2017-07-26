const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://jfbhhzemjqtzjy:420d03ef38cc3a97756c737d7839bcd1a6a26d017793bab834b79565bcb34fb3@ec2-54-225-107-107.compute-1.amazonaws.com:5432/dki5u7o4v56in';

var rows = [];

function executeQuery(q,callback){
   const client = new pg.Client(connectionString);
         client.connect();

   const query = client.query(q);

         query.on('row', (row) => {
             rows.push(row);
             callback(null, {rows: row});
	     });          

         query.on('end', () => { 
             client.end();
         });  
}

module.exports = {
     executeQuery:executeQuery
}
