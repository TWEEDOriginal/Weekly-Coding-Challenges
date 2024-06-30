#! /usr/bin/env node
const functionSet = new Set(["sin", "cos", "tan"]);
const precedence = {
  "^": 4,
  "/": 3,
  "*": 3,
  "+": 2,
  "-": 2,
};
const operatorSet = new Set(["(", ")", "^", "/", "*", "+", "-"]);

// Shunting yard algorithm https://en.wikipedia.org/wiki/Shunting_yard_algorithm#The_algorithm_in_detail
function convertToPostfix(str) {
  const outputQueue = [];
  const operatorStack = [];
  let leftParenthesisCount = 0;
  for (let i = 0; i < str.length; i++) {
    char = str[i];

    if (operatorSet.has(char)) {
      let topOfStack = operatorStack[operatorStack.length - 1];
      //left parenthesis sent to operatorStack always
      if (char === "(" || topOfStack === "(" || operatorStack.length === 0) {
        char === "(" ? leftParenthesisCount++ : null;
        operatorStack.push(char);
        continue;
      }

      if (char === ")") {
        if (leftParenthesisCount < 0)
          throw new Error(
            "invalid input: mismatched parentheses, no left parenthesis"
          );

        while (topOfStack != "(") {
          outputQueue.push(operatorStack.pop());
          topOfStack = operatorStack[operatorStack.length - 1];
        }
        //pop left parenthesis
        operatorStack.pop();
        leftParenthesisCount--;
        topOfStack = operatorStack[operatorStack.length - 1];
        if (functionSet.has(topOfStack)) {
          outputQueue.push(operatorStack.pop());
        }

        continue;
      }

      while (topOfStack != "(" && precedence[topOfStack] >= precedence[char]) {
        outputQueue.push(operatorStack.pop());
        topOfStack = operatorStack[operatorStack.length - 1];
      }
      operatorStack.push(char);
    }
    // if it's a function
    else if (/[A-Za-z]/.test(char)) {
      let value = "";
      while (/[A-Za-z]/.test(char)) {
        value += char;
        char = str[++i];
      }
      // go back to last char
      i--;
      if (!functionSet.has(value))
        throw new Error("invalid input, not a function");
      operatorStack.push(value);
    }
    // if it's a number
    else if (/[\d.]/.test(char)) {
      let value = "";
      while (/[\d.]/.test(char)) {
        value += char;
        char = str[++i];
      }
      // go back to last char
      i--;
      const num = parseFloat(value);
      if (isNaN(num)) throw new Error("invalid input, not a number");
      outputQueue.push(num);
    }
  }

  if (leftParenthesisCount > 0)
    throw new Error(
      "invalid input: mismatched parentheses, no right parenthesis"
    );
  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop());
  }
  return outputQueue;
}

function calculate(queue) {
  const stack = [];
  for (let token of queue) {
    if (typeof token == "number") {
      stack.push(token);
    } else if (operatorSet.has(token)) {
      const [a, b] = stack.splice(stack.length - 2, 2);
      let newNum;
      switch (token) {
        case "^":
          newNum = a ^ b;
          break;
        case "/":
          newNum = a / b;
          break;
        case "*":
          newNum = a * b;
          break;
        case "+":
          newNum = a + b;
          break;
        case "-":
          newNum = a - b;
          break;
        default:
          console.log("invalid token");
      }

      stack.push(parseFloat(newNum));
    } else if (functionSet.has(token)) {
      const num = stack.pop();
      let newNum;
      switch (token) {
        case "sin":
          newNum = Math.sin(num);
          break;
        case "cos":
          newNum = Math.cos(num);
          break;
        case "tan":
          newNum = Math.tan(num);
          break;
        default:
          console.log("invalid token");
      }

      stack.push(parseFloat(newNum));
    }
  }
  return stack[0];
}

async function main() {
  const args = process.argv;
  const outputQueue = convertToPostfix(String(args[2]));
  return calculate(outputQueue);
}

main()
  .then((val) => console.log(val))
  .catch((e) => console.error("No such file or invalid option", e));
