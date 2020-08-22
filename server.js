const server = require('http').createServer();

const pid = process.pid;
let usersCount = 0;

server.on('request', (req, res) => {
    for (let i = 0; i < 1e9; i++);

    res.write(`Handled by process ${pid}\n`);
    res.end(`Users: ${usersCount}`);
});

server.listen(4000, () => console.log(`Started process ${pid}`));

process.on('message', (message) => usersCount = message.usersCount);