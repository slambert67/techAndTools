import { default as express } from 'express';
export const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('in route handler');
    res.render('index', {msg: 'Hi Steve'});  // index refers to view name
})