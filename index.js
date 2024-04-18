const express = require('express');
const fs = require('fs');
const app = express();

const phoneNumbers = [
    "+91-1234-567821",
    "1234-567822",
    "+911234-567823",
    "+91-1234-567824",
    "+91-1234-567825",
    "+91-1234-567826",
    "+91-1234-567827",
    "+91-1234-5677"
];

function isValidPhoneNumber(phoneNumber) {
    const regex = /^\+91-\d{4}-\d{6}$/;
    return regex.test(phoneNumber);
}

function separateNumbers(numbers) {
    const validNumbers = [];
    const invalidNumbers = [];

    numbers.forEach(number => {
        if (isValidPhoneNumber(number)) {
            validNumbers.push(number);
        } else {
            invalidNumbers.push(number);
        }
    });

    return {
        validNumbers,
        invalidNumbers
    };
}


// **** QUESTION 1 ****

app.get('/processPhoneNumbers', (req, res) => {
    const separatedNumbers = separateNumbers(phoneNumbers);

    // Write valid numbers
    fs.writeFile('validNumbers.txt', separatedNumbers.validNumbers.join('\n'), err => {
        if (err) throw err;
        console.log('Valid numbers written to validNumbers.txt file');
    });

    // Write invalid numbers
    fs.writeFile('invalidNumbers.txt', separatedNumbers.invalidNumbers.join('\n'), err => {
        if (err) throw err;
        console.log('Invalid numbers written to invalidNumbers.txt file');
    });

    res.send('Phone numbers processed successfully!');
});


// **** QUESTION 3 ****

app.use(express.json());

app.post('/separate', (req, res) => {
    const inputString = req.query.inputString;

    if (!inputString) {
        return res.status(400).json({ error: 'Please Enter String' });
    }

    const vowels = new Set('aeiouAEIOU');
    const consonants = new Set('bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ');
    const specialCharacters = new Set('-$*()~%#!@^&_');

    const myVovels = new Set();
    const myConsonants = new Set();
    const mySpecialCharacters = new Set();

    // Separate characters
    for (const char of inputString) {
        if (vowels.has(char)) {
            myVovels.add(char);
        } else if (consonants.has(char)) {
            myConsonants.add(char);
        } else if (specialCharacters.has(char)) {
            mySpecialCharacters.add(char);
        }
    }

    // Write to files
    fs.writeFileSync('vowel.txt', [...myVovels].sort().join(''));
    fs.writeFileSync('consonants.txt', [...myConsonants].sort().join(''));
    fs.writeFileSync('special_characters.txt', [...mySpecialCharacters].sort().join(''));

    res.json({ message: 'Characters separated and saved to files successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// **** QUESTION 2 ****

app.get('/convert', (req, res) => {
    const inputNumber = req.query.number;

    if (!inputNumber || !/^\d{10}$/.test(inputNumber)) {
        return res.status(400).send('Error: Please provide a 10-digit phone number');
    }

    const formattedNumber = '+91-' + inputNumber.substring(0, 4) + '-' + inputNumber.substring(4);

    fs.appendFile('dataSet.txt', formattedNumber + '\n', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error: Failed to write in dataSet.txt');
        }
        res.send('Number converted and saved in dataSet.txt: ' + formattedNumber);
    });
});