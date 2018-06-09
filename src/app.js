const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const config = require('config');
const path = require('path');
const core = require('./modules/core');
const user = require('./modules/user');
const applicant = require('./modules/applicant');

const app = express();

process.on('unhandledRejection', (err) => {
    // eslint-disable-next-line no-console
    console.log('Unhandled Rejection:', err.stack);
});

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(path.dirname(__dirname), 'public')));

app.set('trust proxy', 1);

user.passport.configure(app);

// set default express behavior
// disable x-powered-by signature
// and enable case-sensitive routing
app.set('env', config.env);
app.set('x-powered-by', false);
app.set('case sensitive routing', true);

app.use(user.routes);
app.use(applicant.routes);

// use middleware
app.use(core.middleware.apiResponse());

app.use((req, res, next) => {
    const err = new Error('Path Not Found');
    err.code = 404;
    next(err);
});

app.use(core.middleware.apiErrorResponse());

app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});

