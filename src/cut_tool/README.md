# 4. Build Your Own cut Tool:

## Description

Command line tool that replicates unix `cut` which is used to cut out the selected portions from each line in a file. Basic solution that answers all the steps as outlined in the [project requirements](https://codingchallenges.fyi/challenges/challenge-cut/).

## Valid Options

- `-f`: prints out the specified field(s) from each line
- `-d`: Specify what character to use as the delimiter between fields. 

## Usage:

Initialize the project with `npm link`

> Supports the following options:
- Default - use tab for field delimiter
```bash
>cccut -f<i> <file>
 # print out field i
```

- Delimiter support
```bash
>cccut -f1 -d<delimiter> <file>
 # use delimiter e.g "," to separate fields
```

- Field List support
```bash
>cccut -f<list> <file>
 # list is a comma or whitespace separated list of fields, i.e. -f1,2 or -f“1 2”
```

- Able to read from standard input if no filename is specified.

```bash
>tail -n5 <file> | cccut -d, -f"1 2"
 # prints out the first and second fields from the standard input delimited by ","
```

- Pipeline Support: Able to also send to stdOut to be consumed by another process

```bash
>cccut -f2 -d, fourchords.csv | uniq |ccwc -l
 # Logs how many unique artists are in the data set. 
```