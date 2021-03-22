import { default as express } from 'express';
export const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('in route handler');
    res.end('<html><body>You shall not pass</body></html>');
})