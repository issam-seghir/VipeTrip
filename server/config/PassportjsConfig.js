const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const FacebookStrategy = require("passport-facebook");
const TwitterStrategy = require("passport-twitter");
const User = require("@model/User");
const { ENV } = require("@/validations/envSchema");
const bcrypt = require("bcrypt");
const { generateHashedToken } = require("@utils/index");

// async function verifyProvider(accessToken, refreshToken, profile, cb, provider) {
// 	try {
// 		// if user sign in with already existing email , the Oauth account will be linked to his account
// 		let user = await User.findOne({ email: profile.emails[0].value });
// 		console.log(profile);
// 		if (!user) {
// 			// The account at Google has not logged in to this app before.  Create a
// 			// new user record and associate it with the Google account.
// 			user = new User({
// 				firstName: profile.name.givenName,
// 				lastName: profile.name.familyName,
// 				email: profile.emails[0].value,
// 				password: null, // You might want to handle this differently
// 			});
// 		}
// 		// Associate the social media account with the user record.
// 		user.socialAccounts.push({
// 			provider: provider,
// 			userId: profile.id,
// 			displayName: profile.displayName,
// 			profileUrl: profile.profileUrl,
// 			emails: profile.emails.map((email) => email.value),
// 			photos: profile.photos.map((photo) => photo.value),
// 		});

// 		await user.save();

// 		// The account at Google has previously logged in to the app.  Get the
// 		// user record associated with the Google account and log the user in.
// 		return cb(null, user);
// 	} catch (error) {
// 		return cb(error);
// 	}
// }

const passportConfig = (passport) => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: ENV.GOOGLE_CLIENT_ID,
				clientSecret: ENV.GOOGLE_CLIENT_SECRET,
				callbackURL: ENV.GOOGLE_REDIRECT_URI,
				scope: ["profile", "email"],
				// passReqToCallback: true, // verifyProvider(req,accessToken, refreshToken, profile, cb)
			},
			async function verifyProvider(accessToken, refreshToken, profile, cb) {
				try {
					// if user sign in with already existing email , the Oauth account will be linked to his account
					console.log(profile);
					const { id, name, displayName, provider, _json: others } = profile;
					const { picture, email } = others;

					if (!email) return cb(new Error("Failed to receive email from Google. Please try again :("));

					let user = await User.findOne({ email: email });
					if (!user) {
						// The account at Google has not logged in to this app before.  Create a
						// new user record and associate it with the Google account.
						const randomPass = generateHashedToken(20);
						user = new User({
							firstName: name?.givenName,
							lastName: name?.familyName,
							email,
							password: bcrypt.hashSync(randomPass, 10),
						});
					}
					const existingAccount = user.socialAccounts.find(
						(account) => account.provider === provider && account.profileId === id
					);

					if (existingAccount) {
						// Update the existing account with the new access and refresh tokens
						existingAccount.accessToken = accessToken;
						existingAccount.displayName = displayName;
						existingAccount.pictureUrl = picture;
					} else {
						// Add a new entry to the socialAccounts array
						user.socialAccounts.push({
							provider,
							profileId: id,
							displayName: displayName,
							pictureUrl: picture,
							accessToken,
						});
					}

					await user.save();

					// The account at Google has previously logged in to the app.  Get the
					// user record associated with the Google account and log the user in.
					return cb(null, user);
				} catch (error) {
					return cb(error);
				}
			}
		)
	);
	// passport.use(
	// 	new FacebookStrategy(
	// 		{
	// 			clientID: process.env["FACEBOOK_CLIENT_ID"],
	// 			clientSecret: process.env["FACEBOOK_CLIENT_SECRET"],
	// 			callbackURL: "/oauth2/redirect/facebook",
	// 			state: true,
	// 		},
	// 		function verify(accessToken, refreshToken, profile, cb) {
	// 			return verifyProvider(accessToken, refreshToken, profile, cb, "facebook");
	// 		}
	// 	)
	// );

	// passport.use(
	// 	new TwitterStrategy(
	// 		{
	// 			consumerKey: process.env["TWITTER_CONSUMER_KEY"],
	// 			consumerSecret: process.env["TWITTER_CONSUMER_SECRET"],
	// 			callbackURL: "/oauth/callback/twitter",
	// 		},
	// 		function verify(token, tokenSecret, profile, cb) {
	// 			return verifyProvider(token, tokenSecret, profile, cb, "twitter");
	// 		}
	// 	)
	// );

	// passport.use(new GitHubStrategy({
	//   clientID: config.githubClientId,
	//   clientSecret: config.githubClientSecret,
	//   callbackURL: config.githubCallbackURL,
	//   scope: 'user:email',
	//   passReqToCallback: true,
	//   },
	//   async function(req, accessToken, refreshToken, profile, done) {
	//     try {
	//       const email = profile.emails && profile.emails.length ? profile.emails[0].value : null;
	//       if(!email) return done(new Error('Failed to receive email from Github. Please try again :('));

	//       const user = await User.findOne({ 'email': email });

	//       if (user) {
	//         return done(null, user);
	//       }
	//       const newUser = await User.create({
	//         name: profile.displayName,
	//         profileId: profile.id,
	//         email,
	//         accessToken,
	//       });
	//       return done(null, newUser);
	//     } catch (verifyErr) {
	//       done(verifyErr);
	//     }
	//   }

	// ));
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
};

module.exports = { passportConfig };
