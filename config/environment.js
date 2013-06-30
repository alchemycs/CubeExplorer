/* jshint node:true */
'use strict';
var path = require('path');

var rootPath = path.dirname(require.main.filename);

module.exports = function (app, express) {

// all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(rootPath, 'views'));
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(rootPath, 'public')));
    app.use(function(req, res) {
        res.redirect('/#'+req.path);
    });

// development only
    if ('development' === app.get('env')) {
        app.use(express.errorHandler());
    }

};