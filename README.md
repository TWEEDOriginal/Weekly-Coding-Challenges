# Weekly Coding Challenges Solutions - JavaScript

## Introduction

This repository contains JavaScript attempts on [Weekly Coding Challenges](https://codingchallenges.fyi/) by [John Crickett](https://substack.com/redirect/04ecef11-081c-44fc-a020-18af823f5950?j=eyJ1IjoiMjE0Z3NlIn0.MMl2Ac4TZlcDfqjPa9oCA3ScgSl5HapC6eRldM-7MHw)

### 1. Build Your Own wc Tool (ccwc):

#### Description

Command line tool that replicates wc – word, line, character, and byte count. Basic solution that answers all the steps as outlined in the [project requirements](https://codingchallenges.fyi/challenges/challenge-wc/). This assumes just one file, can be modified to accomodate multiple files.

#### Valid Options

- `-c`: outputs the number of bytes in a file
- `-l`: outputs the number of lines in a file
- `-w`: outputs the number of words in a file
- `-m`: outputs the number of characters in a file

#### Usage:

Initialize the project with `npm link`

```bash
>ccwc [option] [file]
 count [file]
```

Default option - i.e. no options are provided

```bash
>ccwc [file]
 lineCount wordCount biteSize [file]
```

Able to read from standard input if no filename is specified.

```bash
>cat [file] | ccwc [option]
 count
```

### 2. Build Your Own JSON Parser:

#### Description

Json parser that parses a JSON file and correctly reports if it is valid or invalid. Basic solution that answers the steps as outlined in the [project requirements](https://codingchallenges.fyi/challenges/challenge-json-parser).


#### Usage:
```bash
>node automate.js

```

