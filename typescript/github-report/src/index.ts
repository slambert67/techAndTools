import {GithubApiService} from './GithubApiService';
import { User } from './User';
import { Repo } from './Repo';
import * as _ from 'lodash';

let svc = new GithubApiService();

if (process.argv.length < 3) {
    console.log('Enter user');
} else {
    let username = process.argv[2];

    svc.getUserInfo(username, (user: User) => {
        console.log(process.argv);
        svc.getRepos(username, (repos: Repo[]) => {
            let sortedRepos = _.sortBy(repos, [ (repo: Repo) => repo.forkCount]);
            let filteredRepos = _.take(sortedRepos, 3);
            user.repos = filteredRepos;
            console.log(user);
        });
    });
}
