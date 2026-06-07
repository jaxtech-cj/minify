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
import fs  from 'fs';
import { bundle } from 'lightningcss';
import { glob } from 'glob';
import UglifyJS from 'uglify-js';


console.log("Minify Utility by Jax Tech");

minifyJS();
//minifyCSS();
//minifyImages();

console.log("Minify Complete");

function minifyJS()
{
	console.log("Minifying JS");
	const inputFile = 'js/main.js';
	const outputFile = 'js/main.min.js';

	const sourceCode = fs.readFileSync(inputFile, 'utf8');
	console.log(sourceCode);
	
	// Configuration options for UglifyJS
    const options = {
        mangle: true, // Shorten variable and function names
        compress: {
            dead_code: true, // Remove unreachable code
            drop_debugger: true, // Remove debugger statements
            drop_console: false // Set to true to strip console.log statements
        }
    };
	// Perform minification
    const result = UglifyJS.minify(sourceCode, options);

    // Check for compilation errors
    if (result.error) {
        throw result.error;
    }

    // Save the minified code to the output file
    fs.writeFileSync(outputFile, result.code, 'utf8');
    console.log(`Success! Minified file saved to: ${outputFile}`);

	  console.log("JS Minifying Complete");
}

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