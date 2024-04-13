const GoogleStrategy = require("passport-google-oidc");
const FacebookStrategy = require("passport-facebook");
const TwitterStrategy = require("passport-twitter");
const User = require("@model/User");
const { ENV } = require("@/validations/envSchema");

const passportConfig =  (passport) => {
passport.use(
	new GoogleStrategy(
		{
			clientID: ENV.GOOGLE_CLIENT_ID,
			clientSecret: ENV.GOOGLE_CLIENT_SECRET,
			callbackURL: "https://www.example.com/oauth2/redirect/google",
		},
		async function verify(issuer, profile, cb) {
			try {
				let user = await User.findOne({ provider: issuer, subject: profile.id });

				if (!user) {
					// The account at Google has not logged in to this app before.  Create a
					// new user record and associate it with the Google account.
					user = new User({
						name: profile.displayName,
						provider: issuer,
						subject: profile.id,
					});

					await user.save();
				}

				// The account at Google has previously logged in to the app.  Get the
				// user record associated with the Google account and log the user in.
				return cb(null, user);
			} catch (error) {
				return cb(error);
			}
		}
	)
);
	passport.use(
		new FacebookStrategy({
			// options and callback
		})
	);
};

module.exports = { passportConfig };
