"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repo = void 0;
class Repo {
    constructor(repo) {
        this.name = repo.name;
        this.description = repo.description;
        this.url = repo.html_url;
        this.size = repo.size;
        this.forkCount = repo.forks;
    }
}
exports.Repo = Repo;
