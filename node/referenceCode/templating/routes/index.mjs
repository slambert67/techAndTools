import { default as express } from 'express';
export const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('in route handler');
    res.render('index', {msg: 'Hi Steve', title:'Partials'});  // index refers to view name
})