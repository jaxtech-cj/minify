/**
 * @file Minifier
 * @since 1.0.0
 * @module app.js
 * @author Corey Jackson <cjaxsn@gmail.com>
 * @requires imagemin, imagemin-webp
 * @copyright Jax Tech
 * @date 2026-06-09
 */

import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import fs  from 'fs';
import path from 'path';
import { bundle, transform } from 'lightningcss';
import { glob, globSync } from 'glob';
import UglifyJS from 'uglify-js';
import { minify } from 'html-minifier-terser';
import { fontawesomeSubset } from "fontawesome-subset";
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { execSync } from 'child_process';
import { promisify } from 'util';

/*
dependencies
npm i html-minifier-terser
*/

console.log("Minify Utility v1 by Jax Tech");

const strFontURL = "http://fightden.ca";
//const strFontURL = "http://127.0.0.1:5500/index.html";
//const strFontURL = "https://coreyjackson.me/index.html";

//faLookup();

//minifyHTML()
//discoverFonts(strFontURL);
//minifyFonts();
//minifyFA();
minifyJS();
//minifyCSS();
//minifyImages();

console.log("Minify Complete");

async function minifyHTML()
{
	
	// Find all HTML files in source directory
	const inputDir = path.join(import.meta.dirname, '/html');
	const outputDir = path.join(import.meta.dirname, '/html/min');

	// Find all .html files recursively
	const htmlfiles = globSync('*.html', { cwd: inputDir });
	console.log(htmlfiles);

	htmlfiles.forEach(async (file) =>
	{
		const inputFilePath = path.join(inputDir, file);
		const outputFilePath = outputDir;

		console.log("MINIFYING HTML file: " + file);
	
		const fileContent = fs.readFileSync(inputFilePath);

		const inputHtml = fs.readFileSync(inputFilePath, 'utf8');

		//Define minification settings (most are disabled by default)
		const options = {
			collapseWhitespace: true,
			removeComments: true,
			keepClosingSlash: true,
			//minifyJS: true, // Minifies inline <script> blocks via Terser
			minifyCSS: true // Minifies inline <style> blocks
		};
			
		try
		{
			// 3. Process the file data
			const minifiedHtml = await minify(inputHtml, options);
			
			// 4. Write the compressed output back to disk
			const outputFile = path.join(outputFilePath, file.substring(0, file.lastIndexOf("."))) + ".min.html";
			//console.log(outputFile);
			
			// Write the minified code to disk
			fs.writeFileSync(outputFile, minifiedHtml);
			console.log(`Minified: ${file}`);
		}
		catch (error) {
			console.error('Error minifying HTML on file:' + file, error);
		}
	});
	//console.log('Minify HTML Completed Successfully');
}

function faLookup()
{
	console.log(faInstagram.iconName);
	console.log(faInstagram.icon[3]);
	console.log(faBriefcase.iconName); // Returns "briefcase"
	console.log(faBriefcase.icon[3]); // Returns "f0b1"
	console.log(faUser.iconName); // Returns "user"
	console.log(faUser.icon[3]); // Returns "f0b1"
}

function discoverFonts(strURL)
{
	console.log("Discover Fonts");
	
	const command = `npx glyphhanger ${strURL} --json`;
	//const command = `npx glyphhanger ${url} --family='Font Awesome 7 Pro'`;
	console.log(command);

	try
	{
		console.log('Crawling for used glyphs');
		execSync(command, { stdio: 'inherit' });
		console.log('Font identification completed successfully!');
	} catch (error)
	{
		console.error('An error occured during font identifaction:', error.message);
		process.exit(1);
	}
}

function minifyFonts()
{
	console.log("minify Fonts");
	
	//https://anylove.jax.tech/emojis
	//https://anyclub.app/index.html
	//http://127.0.0.1:5501/emojis/index.html
	
	async function subsetFonts(strFontPath, strWhitelist)
	{		
		const cmdSubset = `npx glyphhanger --subset=${strFontPath} --whitelist=${strWhitelist} --formats=woff2`;
		//console.log("Subset Command:" + cmdSubset);
		try
		{
			console.log('Subsetting fonts using glyphhanger');
			const output = execSync(cmdSubset, { stdio: 'inherit', encoding: 'utf-8' });
			//console.log(output);
		}
		catch (error)
		{
			console.error('Error during font subsetting:', error.message);
			process.exit(1);
		}
	}

	//fight den
// 	Open Sans": "U+A,U+20-23,U+25-2A,U+2C-3B,U+3E-50,U+52-59,U+5F,U+61-7B,U+7D",
//   "Lato": "U+20,U+26,U+2D,U+41-50,U+52-59",
//   "ETmodules": "U+33,U+49,U+4C,U+61",
//   "Font Awesome 6 Brands": "U+F16D",
//   "Font Awesome 6 Pro": "U+F060-F062,U+F095" }
	subsetFonts('fonts/fa-brands-400.woff2', "U+20,U+2F,U+F16D");
	subsetFonts('fonts/pro-fa-solid-900-0.woff2', "U+20,U+2F,U+F060-F062,U+F095");
	//subsetFonts('fonts/fa-solid-900.woff2', "");

	//glyphhanger --subset=path/to/fontawesome-solid.ttf --whitelist=U+F007,U+F00c --formats=woff2
	//subfont http://127.0.0.1:5501/index.html -o fonts
	
	//Step 1
		//glyphhanger http://127.0.0.1:5501/index.html --json
		//This will print a JSON array of the Unicode values for your icons in the terminal.
		//FA 7 Pro - U+20,U+2F,U+E1C6,U+F004,U+F143,U+F1E0
		//FA 7 Brands - U+20,U+2F,U+E61A,U+E671,U+F0D2,U+F16D

		//RSS - F143
		//LAPTOP - e1c6
		//HEART - f004

	//Step 2
	//glyphhanger --subset=fonts/fa/fa-brands-400.woff2 --whitelist=U+E61A,U+E671,U+F0D2,U+F16D --formats=woff2
	//glyphhanger --subset=fonts/fa/fa-regular-400.woff2 --whitelist=U+E1C6,U+F004,U+F143,U+F1E0 --formats=woff2
	//glyphhanger --subset=fonts/fa/fa-solid-900.woff2 --whitelist= --formats=woff2

	//glyphhanger http://127.0.0.1:5501/index.html --json
	//glyphhanger http://127.0.0.1:5501/index.html --family='Font Awesome 7 Pro'
	//glyphhanger http://127.0.0.1:5501/index.html --json --family='Roboto'
    //glyphhanger http://127.0.0.1:5501/index.html --json --family='Font Awesome 7 Pro Solid'

	//glyphhanger http://127.0.0.1:5501/index.html --family='Roboto' --subset="*.ttf"
	//glyphhanger http://127.0.0.1:5501/index.html --family='Roboto' --formats=woff2,woff --subset="*.woff2" --output=fonts
	console.log('Font subsetting completed successfully!');
}

function minifyFA()
{
	//npm i fontawesome-subset
	//npm i @fortawesome/fontawesome-pro
	//npm uninstall @fortawesome/fontawesome-free
	//npm i '@awesome.me/kit-KIT_CODE@latest'

	console.log("Minify Font Awesome");
	fontawesomeSubset(
	{
		regular: ["fa-share-nodes"],
		brands: ["fa-instagram", "fa-square-x-twitter", "fa-facebook", "fa-bluesky", "fa-pinterest"],
		solid: ["fa-square-rss", "fa-laptop-arrow-down"],
	},
	"sass/webfonts",
    {
        package: "pro"
    });
	console.log("Font Awesome Minifying Complete");
}

function minifyJS()
{

	console.log("Minifying JS");

	// Configuration options for UglifyJS
    const options = {
        mangle: true, // Shorten variable and function names
        compress: {
            dead_code: true, // Remove unreachable code
            drop_debugger: true, // Remove debugger statements
            drop_console: false // Set to true to strip console.log statements
        }
    };


	// Find all CSS files in your source directory
const inputDir = path.join(import.meta.dirname, '/js');
const outputDir = path.join(import.meta.dirname, '/js/min');

// Ensure output sub-directories exist
fs.mkdirSync(path.dirname(outputDir), { recursive: true });
	

 // Find all .css files recursively
const jsfiles = globSync('*.js', { cwd: inputDir });
console.log(jsfiles);

jsfiles.forEach(file => {
	try
	{
		const inputFilePath = path.join(inputDir, file);
		const outputFilePath = outputDir;

		console.log("MINIFYING JS: " + file);
		// Read input file
		const fileContent = fs.readFileSync(inputFilePath, 'utf8');

	
		// Minify JS
    	const result = UglifyJS.minify(fileContent, options);

		// Check for compilation errors
		if (result.error) {
			throw result.error;
		}
		
		const outputFile = path.join(outputFilePath, file.substring(0, file.lastIndexOf("."))) + ".min.js";
		console.log(outputFile);
		// Write the minified code to disk
		fs.writeFileSync(outputFile, result.code);
		console.log(`Minified: ${file}`);
    }
	catch (error)
	{
		console.log('\x1b[31m%s\x1b[0m', error.message);
		//console.error('Error during Lightning CSS minify:', error.message);
	}
});	

	  console.log("JS Minifying Complete");
}

function minifyCSS()
{
// Find all CSS files in your source directory
const inputDir = path.join(import.meta.dirname, '/css');
const outputDir = path.join(import.meta.dirname, '/css/min');

// Ensure output sub-directories exist
fs.mkdirSync(path.dirname(outputDir), { recursive: true });
	

 // Find all .css files recursively
const cssfiles = globSync('*.css', { cwd: inputDir });
console.log(cssfiles);

cssfiles.forEach(file => {
	try
	{
		const inputFilePath = path.join(inputDir, file);
		const outputFilePath = outputDir;

		console.log("MINIFYING CSS: " + file);
		// Read input file
		const fileContent = fs.readFileSync(inputFilePath);

	
		// Minify using Lightning CSS
		const { code } = transform({
		filename: file,
		code: fileContent,
		minify: true,
		sourceMap: false, 
		});

		const outputFile = path.join(outputFilePath, file.substring(0, file.lastIndexOf("."))) + ".min.css";
		console.log(outputFile);
		// Write the minified code to disk
		fs.writeFileSync(outputFile, code);
		console.log(`Minified: ${file}`);
    }
	catch (error)
	{
		console.log('\x1b[31m%s\x1b[0m', error.message);
		//console.error('Error during Lightning CSS minify:', error.message);
	}
});	
	


	console.log("CSS Minifying Complete");
}

function minifyImages()
{
	const files = imagemin(['images/*.{jpg,png,webp}'], {
		destination: 'images/min',
		plugins: [
			imageminWebp({quality: 75})
		]
	});

	console.log(files);
	console.log('Image optimization complete');
}