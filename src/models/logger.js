const fs = require("fs");

class Logger {
    static test(message, item) {
        const text = item ? `${message}${JSON.stringify(item)}\n` : `${message}\n`;

        item ? console.log(message, item) : console.log(message); // mostra no console as mensagens do teste

        fs.appendFileSync("src/data/test.txt", text);
    }

    static log(error) {
        const timestamp = new Date().toISOString();
        const message = `[${timestamp}] - ${error}\n`;
        fs.appendFileSync("src/data/log.txt", message);
        this.test(message);
    }
}

module.exports = Logger;