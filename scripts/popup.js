
// // Utilities List // //

// List -> Commas [✔️]

// Word Count [✔️]

// Random string generator [✔️]

// IPV4 validator/generator [✔️]

// Random SIN generator [✔️]

// SIN validator [✔️]

// Random hex color generator [✔️]

// Google Search [✔️]

// Time Zone converter + detector [in progress]

// Remove Duplicates From CSV/New line SV list (e.g. used for Spotify)

// Hard To Do/Will Take More Thinking/Time/Etc.:

// Random font picker 

// Unit Converter 

// IPV6 validator/generator 

// Weather 


// Triggers when all DOM elements are loaded
document.addEventListener('DOMContentLoaded', function(event) 
{
	initTimezoneData();

	document.querySelector('#convertTZ').addEventListener('click', async function(event2) 
  {
  	// error handling here : ...

  	let from = validateAndGetInput("fromInputTimezone", "Please ensure a valid from timezone is selected.");
  	let to = validateAndGetInput("toInputTimezone", "Please ensure a valid to timezone is selected.");
  	let time = validateAndGetInput("inputDateTime", "Please ensure a valid to timezone is selected.");
  	let convertedTime = convertTimeZones(from, to, time);
  	let output = displayDateTime(convertedTime, to);
  	console.log(convertedTime, output);

  });

	document.querySelector('#listToCommas').addEventListener('click', async function(event2) 
  {
  	let list = validateAndGetInput("listInput", "Please enter a space or newline separated list to continue.");
  	if (list != null)
  	{
  		await convert(list);
  	}
  });

   document.querySelector('#genRandomStr').addEventListener('click', async function(event2) 
   {
  	let desiredLength = document.querySelector('#desiredLenInput').value;
  	if ((!desiredLength == "" || !desiredLength == null) && (isNaN(desiredLength) || +desiredLength <= 0))
  	{
  		console.error('Error message to display...');
  		alert("Please specify a valid length or simply leave it blank (default length is 20).");
  		return;
  	}

  	// console.log(desiredLength);
  	let formElems = document.querySelector("#genRandomStrForm").children;
  	let exclusions = 
  	{
  		upperLetters: false, 
  		lowerLetters: false, 
	  	numbers: false, 
	  	symbols: false
  	};

  	if (formElems != null)
  	{
  		exclusions.upperLetters = formElems.upperLetters.checked;
  		exclusions.lowerLetters = formElems.lowerLetters.checked;
  		exclusions.symbols = formElems.symbols.checked;
  		exclusions.numbers = formElems.numbers.checked;

  		if (exclusions.upperLetters && exclusions.symbols && exclusions.numbers && exclusions.lowerLetters)
  		{
  			console.error('Error message to display...');
  			alert("Please leave at least one of the above checkboxes unchecked.")
  			return;
  		}
  	}

  	else 
  	{
  		console.error("Failed to get random str form, assuming no exclusions but error.");	
  	}

  	const generatedStr = 
  	(desiredLength == "" || desiredLength == null ? generateRandomString(exclusions) : generateRandomString(exclusions, desiredLength));

   	copyAndNotify(generatedStr, "Random string generated and copied! String: " + generatedStr);
   });

  document.querySelector('#validateSIN').addEventListener('click', function(event2) 
  {
  	let SIN = validateAndGetInput("SINInput", "Please enter a SIN to continue.");
  	if (SIN != null)
  	{
  		let sinValidationOutput = "SIN is " + (isValidSIN(SIN) ? "valid" : "invalid") + ".";
  		alert(sinValidationOutput);
  		console.log(isValidSIN(SIN));
  	}
  });

  document.querySelector('#generateRandomSIN').addEventListener('click', async function(event2) 
  {
  	let SIN = randomSINGeneratorV2();
  	copyAndNotify(SIN, "Random SIN generated and copied! SIN: " + SIN);
  });

   document.querySelector('#generateRandomColor').addEventListener('click', async function(event2) 
  {
  	const hexCode = generateRandomHexCode();
  	document.querySelector('#randomColor').style.backgroundColor = hexCode;
  	document.querySelector('#randomColor').style.height = "3em";
  	await copyAndNotify(hexCode, "Random colour's hex code generated and copied! Code: " + hexCode);
  });

  document.querySelector('#validateIPV4').addEventListener('click', function(event2) 
  {
  	let input = validateAndGetInput("IPV4Input", "Please enter an input to continue.");
  	if (input != null)
  	{
	  	let validity = isIPV4Valid(input);
	  	let IPV4ValidationOutput = "IP address is " + (validity ? "valid" : "invalid") + ".";
	  	alert(IPV4ValidationOutput);
	  	console.log(validity);	
  	}
  });   

  document.querySelector('#wordCount').addEventListener('click', function(event2) 
  {	
  	let input = validateAndGetInput("wordsInput", "Please enter an input to continue.");
  	let exclusionMaxLen = document.querySelector('#wordLenExclusion').value;
  	exclusionMaxLen = exclusionMaxLen == null || exclusionMaxLen == "" ? 0 : exclusionMaxLen;
  	if (input != null)
  	{
  		let wordCount = countWords(input, exclusionMaxLen);
	  	console.log(wordCount);
	  	let wordCountOutput = "Input is " + wordCount + " words long."
	  	alert(wordCountOutput);
	  	let outputDiv = document.querySelector('#wordCountOutput');
	  	outputDiv.innerHTML = wordCountOutput;
  	}
  });

  document.querySelector('#search').addEventListener('click', async function(event2)
  {
  	let input = validateAndGetInput("searchInput", "Please enter an input to continue.");
  	if (input != null)
  	{
  		await searchInternet(input);
  	}
  });
});

const copyAndNotify = async (output, outputMsg) => 
{
	console.log(output);
	await navigator.clipboard.writeText(output);
	alert(outputMsg);
}

const convert = async (list) => 
{	
	console.log(list);

	let output = "";
	let counter = 1;

	for (char of list.trim())
	{
		if (char !== "\n" && char !== " ")
		{
			output+=char;
		}

		else
		{
			counter+=1;
			output+=", ";
		}
	}

	console.log(counter + " # of items in final list.")
	await copyAndNotify(output, "Copied!");
	return;
}

const generateRandomString = (exclusions, desiredLength = 20, levelOfRandomness = 10) =>
{	
	/*
	// levelOfRandomness should be on a scale from 1 to 10 for speed-randomness balanceness
	// Big-O time: 
	// n here is 94, as that's the length of randomCharPool.
	// shuffleArr is O(n).
	// Array.from is O(n) as well
	// The for loop in step 3 is O(desiredLength).
	// Since the for loop in step 2 is O(1000*levelOfRandomness), the total Big(O) of this algorithm is:
	// Big(O) = O(n) + O(1000*levelOfRandomness*n) + O(desiredLength)
	// O(1000*levelOfRandomness*n) is the biggest level of magnitude here. 
	// For default levelOfRandomness 10, therefore the big O is O(1000*10*n) or O(10000n) or O(n).

	// Speed example: levelOfRandomness = 10 is 10000 iterations in step 3, which takes about 20 milliseconds.
	// levelOfRandomness = 10 gives a very high level of randomness, with a neglible runtime
	*/

	// randomCharPool is generated in Python using 2 lines of code:

	/* 
		import string
		print(string.ascii_letters + string.digits + string.punctuation)-
	*/ 

	// This yields this string:
	// abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~


	console.time("generateRandomString");

	// Step 1: get randomCharPool based on exclusions
	let randomCharPool = "";
	if (!exclusions.upperLetters)
	{
		randomCharPool+="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	}

	if (!exclusions.lowerLetters)
	{
		randomCharPool+="abcdefghijklmnopqrstuvwxyz";
	}

	if (!exclusions.symbols)
	{
		randomCharPool+="!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
	}

	if (!exclusions.numbers)
	{
		randomCharPool+="0123456789";
	}

	let randomCharArr = Array.from(randomCharPool);
	let output = "";

	// Step 2: shuffle random characters i amount of times to ensure randomness
	for (let i = 0; i<(1000*levelOfRandomness); i++)
	{
		randomCharArr = shuffleArr(randomCharArr);
	}

	const randomizedStr = randomCharArr.join('');
	console.log(randomizedStr);

	// Step 3: randomly pick out characters until the desired string length is met
	for (let i = 0; i<desiredLength; i++)
	{
		output+=randomizedStr[getRandomInteger(randomizedStr.length-1)];
	}

	console.timeEnd("generateRandomString");

	console.log(desiredLength, levelOfRandomness, output);
	return output;
}

const getRandomInteger = (max, min = 0) => 
{
	// gets random integer from min to max, inclusive - that is [min, max], mathematically written
  	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const shuffleArr = (arr) =>
{
  // understand algorithm fully
  for (let i = arr.length - 1; i > 0; i--) 
  {
  	const j = getRandomInteger(i);
    // console.log(i, j);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // console.log(arr);
  return arr;
}

const isValidSIN = (input) =>
{
	let num = String(input);
	console.log(num, input);
	if (input == null || isNaN(num) || num.length != 9)
	{
		return false;
	}

	let productStr = "";
	let productSum = 0;
	for (let i = 0; i<num.length; i++)
	{
		if (i % 2 == 0)
		{
			productStr+=num[i];	
		}
		
		else
		{
			productStr+=num[i]*2;
		} 
	}

	console.log(productStr);
	for (let digit of productStr)
	{
		productSum+=+digit;
	}

	console.log(productSum);
	return (productSum % 10 == 0);
}

const randomSINGenerator = () => 
{
	// random sin generator method 1
	// generate a random digit for each digit, combine digits to generate the random integer
	// per digit method
	let SinStr = "";
	let counter = 0;
	while (!isValidSIN(SinStr))
	{
		counter++;
		for (let i = 0; i<9; i++)
		{
			SinStr+=getRandomInteger(9);
		}
	}

	console.log('Random Sin Generator took ' + counter + ' number of times to generate a random SIN');
	return SinStr;
}

const randomSINGeneratorV2 = () => 
{
	// currently using this method as mathematically, as method 1 is way too inefficient and slow because of the nested for loop
	// this method also ensures random SINs, but more efficiently

	// random sin generator method 2
	// use the minimum and maximum mathematically possible 9 digit numbers to generate the random integer
	// per number method
	let SINNum = 0;
	let counter = 0;
	while (!isValidSIN(SINNum))
	{
		counter++;
		SINNum = getRandomInteger(999999999, 100000000);
	}

	console.log('Random Sin Generator V2 took ' + counter + ' number of times to generate a random SIN');
	return SINNum;
}

const generateRandomHexCode = () => 
{	
	let randomCode = "#";
	for (let i = 0; i<6; i++)
	{
		randomCode+=getRandomInteger(15).toString(16);
	}

	console.log(randomCode);
	return randomCode;
}

const isIPV4Valid = (address) => 
{
	if (address == null || address == "")
	{
		return false;
	}

	const parts = String(address).split(".");

	if (parts.length !== 4)
	{
		return false;
	}

	for (let part of parts)
	{
		// 8 bits max per part
		if (part == null || isNaN(part) || +part < 0 || +part > 255)
		{
			return false;
		}
	}

	return true;
}

const countWords = (words, exclusionMaxLen = 0) =>
{
	// possible TODO: return # of characters too from this function, and display
	let wordsArr = words.split(/\s+/);
	console.log(wordsArr);
	return (wordsArr.filter(word => word.length > exclusionMaxLen)).length;
}

const searchInternet = async (input) => 
{
	// uses Google search engine
	window.open("http://google.com/search?q=" + input);
}

const validateAndGetInput = (inputId, errMsg) =>
{
	let input = document.querySelector("#" + inputId).value;
	console.log(input);
	if (input == null || input == "")
	{
  	alert(errMsg);
  	return;
  }

  return input;
}

const removeDuplicates = () =>
{
	// TODO: code here

	return "";

}

const isIPV6Valid = (address) => 
{
	// TODO: code here

	return false;
}

const getUserTimezone = () => 
{
	// returns string
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const getAllTimeZones = () => 
{
	// returns array of strings
	return Intl.supportedValuesOf('timeZone');
}

const initTimezoneData = () =>
{	
	// init neccesary variables
	const userTimezone = getUserTimezone();
	const utcTimezone = "Europe/London"; // known fact
	const timezones = getAllTimeZones();
	let listElements = [];
	let fromInputTzBox = document.querySelector("#fromInputTimezone");
	let toInputTzBox = document.querySelector("#toInputTimezone");
	listElements.push(document.querySelector('#fromTimezones'));
	listElements.push(document.querySelector('#toTimezones'));

	// set user's default time zone
	document.querySelector("#userTimezone").innerHTML = userTimezone;

	// set dault datetime
	setDefaultInputDatetime();

	// set up timezone dropdowns, with default options
	for (let element of listElements)
	{
		for (let timezone of timezones)
		{
			let newOption = document.createElement("option");
			newOption.textContent = timezone;
			newOption.value = timezone;
			element.appendChild(newOption);

			if (timezone === userTimezone)
			{
				fromInputTzBox.value = timezone;
			}

			if (timezone === utcTimezone)
			{
				toInputTzBox.value = timezone;
			}
		}
	}
}

const setDefaultInputDatetime = () =>
{
	// set user datetime to current user datetime
	// we want the first 17 characters from moment().format():
	// moment().format() string: "2023-02-04T00:45:56-07:00" 
	// target string: "2023-02-04T01:42"
	const userTimezoneElem = document.querySelector("#inputDateTime");
	userTimezoneElem.value = moment().format().slice(0, 16);
}

const convertTimeZones = (from, to, dateTime) =>
{
	// use moment-t zto convert timezones and format times from from timezone  to timezone easily
	console.log(from, to, dateTime);

	// todo replace .format() string to something more readable
	let fromDT = moment.tz(dateTime, from);
	let toDT = fromDT.clone().tz(to); // use .format() and use a string to format as you want
	console.log(fromDT.format(), toDT.format());

	return toDT;
}

const displayDateTime = (dateTime, to) => 
{
	let offset = getUTCOffsetFromMomentDTInHours(dateTime);
	let outputStr = "It is " + dateTime.format("MMMM Do, YYYY h:mm A") + " in " + to;
	outputStr += getUTCOffsetString(offset);
	return outputStr;
}

const getUTCOffsetString = (offset) =>
{	
	let baseEndStr = " UTC time).";

	if (offset === 0)
	{
		return " (even with" + baseEndStr;
	}

	return " (" + offset + " hours " + (offset < 0 ? "behind" : "ahead of") + baseEndStr;
}

const getUTCOffsetFromMomentDTInHours = (dateTime) =>
{
	return (dateTime.utcOffset())/60;
}
