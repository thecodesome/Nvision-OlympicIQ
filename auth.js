const passport = require("passport");
const Strategy = require("passport-facebook").Strategy;
const config = require("./config");
const User = require('./models/user');

passport.use(new Strategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'email', 'picture']
}, function (accessToken, refreshToken, profile, cb) {
    process.nextTick(function () {
        User.findOne({
            email: profile.emails[0].value
        }, function (err, user) {
            if (err) return cb(err);
            else if (user) return cb(null, user);
            else {
                const user = new User();
                user.id = profile.emails[0].value;
                user.facebook.id = profile.id;
                user.facebook.token = accessToken;
                user.displayName = profile.displayName;
                user.email = profile.emails[0].value;
                user.picture = profile.photos[0].value;
                user.games = [];
                user.questions = [];
                for (var i=0; i<Questions.length; i++) {
                    user.questions.push(i);
                }
                for (var i=0; i<Questions.length; i++) {
                    var r = Math.floor(Math.random()*Questions.length);
                    user.questions[r] = i;
                    user.questions[i] = r;
                }
                user.save(function (err, user) {
                    if (err) return cb(err);
                    else return cb(null, user);
                });
            }
        });
    });
}));

passport.serializeUser(function (user, cb) {
    console.log(user);
    return cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    User.findOne({id:id}, function (err, user) {
        if (err) return cb(err);
        else return cb(null, user);
    });
});

module.exports = passport;