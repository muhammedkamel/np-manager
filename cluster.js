const cluster = require('cluster');
const os = require('os');

const numOfusersInDB = function () {
    this.count = this.count || 5;
    this.count = this.count * this.count;
    return this.count;
}

if (cluster.isMaster) {
    const cpus = os.cpus().length;

    console.log(`Starting ${cpus} nodes`);

    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }

    const updateWorkers = () => {
        const usersCount = numOfusersInDB();
        Object.values(cluster.workers).forEach(worker => {
            worker.send({ usersCount });
        })
    };

    updateWorkers();
    setInterval(updateWorkers, 10000);
} else {
    require('./server');
}