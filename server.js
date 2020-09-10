const server = require('http').createServer();
const pid = process.pid;

server.on('request', (req, res) => {
    for (let i = 0; i < 1e9; i++);

    res.end(`Handled by process ${pid}\n`);
});

server.listen(3000, () => console.log(`Started process ${pid}`));