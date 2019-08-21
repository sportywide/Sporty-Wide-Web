import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const OtherPage = () => (
	<div>
		<Head>
			<title>Other page</title>
		</Head>
		<h1>Other Page</h1>
		<Link href="/">
			<a>Get back to &quot;/&quot;</a>
		</Link>
	</div>
);

export default OtherPage;
