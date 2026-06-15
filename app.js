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

const strFontURL = "http://127.0.0.1:5500/index.html";
//const strFontURL = "https://coreyjackson.me/index.html";

//faLookup();

minifyHTML()
//discoverFonts(strFontURL);
//minifyFonts();
//minifyFA();
//minifyJS();
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

	subsetFonts('fonts/fa-brands-400.woff2', "U+20,U+2F,U+E5AE,U+E663,U+F08C,U+F092,U+F16D,U+F368");
	subsetFonts('fonts/fa-regular-400.woff2', "U+20,U+2F,U+E042,U+E0C6,U+E0D2,U+E0DC,U+E0E9,U+E165,U+E1EC,U+E206,U+E267,U+E3D1,U+E471,U+E4A2,U+E4E5,U+E533,U+E54B,U+E574,U+E5E9,U+E5FD,U+E699,U+E6A1,U+F007,U+F015,U+F023,U+F085,U+F08E,U+F0AE,U+F0B1,U+F0C2,U+F0C5,U+F0D1,U+F0EC,U+F0F2,U+F126,U+F133,U+F19D,U+F1AB,U+F1C0,U+F1C9,U+F228,U+F247,U+F2DB,U+F2EC,U+F37E,U+F3B3,U+F40E,U+F49C,U+F508,U+F52D,U+F534,U+F542,U+F56D,U+F57D,U+F5AB,U+F5BB,U+F5DA,U+F5F3,U+F611,U+F643,U+F647,U+F6FF,U+F78A,U+F7E7,U+F7EA,U+F808,U+F82C");
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
	const files = imagemin(['images/*.{jpg,png,webp}'], {
		destination: 'images/min',
		plugins: [
			imageminWebp({quality: 75})
		]
	});

	console.log(files);
	console.log('Image optimization complete');
}