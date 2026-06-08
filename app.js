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
import path from 'path';
import { bundle, transform } from 'lightningcss';
import { glob, globSync } from 'glob';
import UglifyJS from 'uglify-js';
import { fontawesomeSubset } from "fontawesome-subset";


console.log("Minify Utility by Jax Tech");

minifyFA();
//minifyFonts();
//minifyJS();
//minifyCSS();
//minifyImages();

console.log("Minify Complete");

function minifyFA()
{
	//npm i fontawesome-subset
	//npm i @fortawesome/fontawesome-pro
	//npm i @fortawesome/fontawesome-free
	console.log("Minify Font Awesome");
	fontawesomeSubset(
	{
		regular: ["fa-share-nodes"],
		brands: ["fa-instagram", "fa-square-x-twitter", "fa-facebook", "fa-bluesky", "fa-pinterest"],
		solid: ["fa-square-rss", "fa-laptop-arrow-down"],
	}, 'famin');
	console.log("Font Awesome Minifying Complete");
}

function minifyFonts()
{
	console.log("minify Fonts");
	//subfont http://127.0.0.1:5501/index.html -o fonts
	//glyphhanger http://127.0.0.1:5501/index.html
	//glyphhanger http://127.0.0.1:5501/index.html --family='Roboto'
	//glyphhanger http://127.0.0.1:5501/index.html --family='Roboto' --subset="*.ttf"
	//glyphhanger http://127.0.0.1:5501/index.html --family='Roboto' --formats=woff2,woff --subset="*.woff2" --output=fonts
	
}

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

function minifyCSS()
{
	// Find all CSS files in your source directory
	const inputDir = path.join(import.meta.dirname, '/css');
	const outputDir = path.join(import.meta.dirname, '/css/min');

	 // Find all .css files recursively
	const cssfiles = globSync('*.css', { cwd: inputDir });
	console.log(cssfiles);

	cssfiles.forEach(file => {
		const inputFilePath = path.join(inputDir, file);
		const outputFilePath = outputDir;
	
		console.log("MINIFYING: " + file);
		// Read input file
		const fileContent = fs.readFileSync(inputFilePath);
	
		// Minify using Lightning CSS
		const { code } = transform({
		  filename: file,
		  code: fileContent,
		  minify: true,
		  sourceMap: false, 
		});
		
		// Ensure output sub-directories exist
		fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
		
		const outputFile = path.join(outputFilePath, file.substring(0, file.lastIndexOf("."))) + ".min.css";
		console.log(outputFile);
		// Write the minified code to disk
		fs.writeFileSync(outputFile, code);
		console.log(`Minified: ${file}`);
	});

	/*
	// Write the minified payload to disk
	fs.writeFileSync('css/min/all.min.css', code);
	*/

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