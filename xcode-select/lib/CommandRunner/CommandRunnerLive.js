"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandRunnerLive = void 0;
const child_process_1 = require("child_process");
class CommandRunnerLive {
    run(cmd) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(cmd, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                }
                else if (stderr) {
                    reject(stderr);
                }
                else {
                    resolve(stdout);
                }
            });
        });
    }
}
exports.CommandRunnerLive = CommandRunnerLive;
