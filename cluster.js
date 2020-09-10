const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const cpus = os.cpus().length;

    console.log(`Starting ${cpus} nodes\nMaster PID ${process.pid}`);

    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(`Worker ${worker.id} crashed. Starting a new worker...`);
            cluster.fork();
        }
    });

    process.on('SIGINT', async () => {
        const workers = Object.values(cluster.workers);
        for (const worker of workers) {
            await restartWorker(worker);
        }
    });
} else {
    require('./server');
}

async function restartWorker(worker) {
    if (!worker) return;

    return new Promise(resolve => {
        worker.on('exit', () => {
            if (!worker.exitedAfterDisconnect) return;
            console.log(`Exited process ${worker.process.pid}`);
            resolve(cluster.fork());
        })
    });
}