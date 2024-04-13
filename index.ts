#! /usr/bin/env node

import inquirer from "inquirer";
import gradient from "gradient-string";
import chalk from "chalk";
import fetch from "node-fetch";


const lineLength = process.stdout.columns;
const line = gradient.rainbow("=".repeat(lineLength));

const heading = "Code With Abdul Waheed";
const paddingLength = Math.floor((lineLength - heading.length) / 2);
const paddedHeading = "=".repeat(paddingLength) + heading + "=".repeat(paddingLength);

console.log(line);
console.log(paddedHeading);
console.log(line);





const apiLink: string =
  "https://opentdb.com/api.php?amount=6&category=18&type=multiple";

let fetchData = async (data: string) => {
  let fetchQuiz: any = await fetch(data);
  let res = await fetchQuiz.json();
  return res.results;
};

let data = await fetchData(apiLink);
let startQuiz = async () => {
  let score: number = 0;
  // for user name
  let name = await inquirer.prompt({
    type: "input",
    name: "fname",
    message: "What is your name?",
  });

  for (let i = 0; i < 5; i++) {
    displayQuestion(data[i], i + 1);
    let answers = [...data[i].incorrect_answers, data[i].correct_answer];
    let ans = await inquirer.prompt({
      type: "list",
      name: "quiz",
      message: "Your answer:",
      choices: answers.map((val: any) => val),
    });
    if (ans.quiz === data[i].correct_answer) {
      ++score;
    }
  }
  console.log(
    `Dear ${chalk.green.bold(name.fname)}, your score is ${chalk.red.bold(
      score
    )} out of ${chalk.red.bold("5")}`
  );
};

const displayQuestion = (question: any, index: number) => {
  console.log(chalk.yellow(`Question-${index}:`));
  let lines = wrapText(question.question, 60); // Wrap text to fit 60 characters per line
  lines.forEach((line) => console.log("  " + line));
  console.log(); // Add an empty line for spacing
};

const wrapText = (text: string, width: number) => {
  let words = text.split(" ");
  let lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if (currentLine.length + word.length + 1 <= width) {
      currentLine += (currentLine.length === 0 ? "" : " ") + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
};

startQuiz();
