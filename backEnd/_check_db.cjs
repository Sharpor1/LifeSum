const Database = require('better-sqlite3');
const db = new Database('D:\\Words,archivos, etc\\CODIGO\\Portafolio\\Proyecto Calendario\\LifeSum\\backEnd\\data\\lifesum.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log('TABLES:', JSON.stringify(tables.map(t => t.name)));
for (const t of tables) {
  const cols = db.prepare('PRAGMA table_info(' + t.name + ')').all();
  console.log('\n' + t.name + ':');
  console.log(JSON.stringify(cols.map(c => ({name: c.name, type: c.type})), null, 2));
}
console.log('\n=== USERS CONTENT ===');
const users = db.prepare('SELECT * FROM users').all();
console.log(JSON.stringify(users, null, 2));
console.log('\n=== PROJECTS CONTENT ===');
const projects = db.prepare('SELECT * FROM projects').all();
console.log(JSON.stringify(projects, null, 2));
