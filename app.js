/**
 * @file Minifier
 * @since 1.0.0
 * @module app.js
 * @author Corey Jackson <cjaxsn@gmail.com>
 * @requires imagemin, imagemin-webp
 * @copyright Jax Tech
 */

import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import { bundle } from 'lightningcss';
import { fs } from 'fs';
import { glob } from 'glob';

console.log("Minify Utility by Jax Tech");

minifyCSS();
minifyImages();

console.log("Minify Complete");

function minifyCSS() {
	// Find all CSS files in your source directory
	const cssfiles = glob.sync('src/**/*.css');
	console.log(cssfiles);

	// Process and minify the external file
	let { code, map } = bundle({
		filename: 'css/all.css',
		minify: true,
		sourceMap: true // Optional: Generates a source map
	});

	// Write the minified payload to disk
	fs.writeFileSync('css/min/all.min.css', code);
	console.log("CSS Minifying Complete");
}

function minifyImages()
{
	const files = imagemin(['images/*.{jpg,webp}'], {
		destination: 'images/min',
		plugins: [
			imageminWebp({quality: 75})
		]
	});

	console.log(files);
	console.log('Image optimization complete');
}