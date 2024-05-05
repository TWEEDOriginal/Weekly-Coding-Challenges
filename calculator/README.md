# 7. Build Your Own Calculator:

## Description

Command line tool that parses a mathematical expression and performs the relevant calculations before returning the answer.

For example, input `2 * 3 + 4` and get back 10, or input `10 / (6 - 1)` and get back 2.

Basic solution that answers all the steps as outlined in the [project requirements](https://codingchallenges.fyi/challenges/challenge-calculator).

### Valid Operators
- `+`: Addition
- `-`: Subtraction
- `*`: Multiplication
- `/`: Division
- `^`: Exponentiation
- `(`: Left Parenthesis
- `)`: Right Parenthesis

### Valid Functions
- `sin`
- `cos`
- `tan`

**NOTE:** This implementation does not implement composite functions, functions with multiple arguments, or unary operators.

## Usage:
Initialize the project with `npm link`

```bash
>calc <mathematical-expression>
 e.g. calc '10 / (6 - 1)'   
```
