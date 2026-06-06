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

console.log("Minify Utility by Jax Tech");
//process.exit()

const files = await imagemin(['images/*.{jpg,webp}'], {
	destination: 'images/min',
	plugins: [
		imageminWebp({quality: 75})
	]
});

console.log(files);
console.log('Images optimized');