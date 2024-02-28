// error page for react router errors

import React from 'react'

export default function Error() {
	return (
		<div className="error-page">
			<h1>Oops!</h1>
			<h2>404 Not Found</h2>
			<p>Sorry, an error has occured, the page you are looking for could not be found!</p>
			<a href="/">Go home</a>
		</div>
	);
}
