# 6. Build Your Own sort tool:

## Description

Command line tool that replicates unix `sort` which is used to sort text files by lines. Basic solution that answers all the steps as outlined in the [project requirements](https://codingchallenges.fyi/challenges/challenge-sort).

## Valid Options

- `-u`: remove duplicate lines.
- `--algorithm`: The algorithm used to sort the data. The available algorithms are:
  - `--merge-sort`
  - `--quick-sort`
  - `--heap-sort`
  - `--random-sort`
  - Default algorithm: inbuilt `sort()` [timSort]

## Usage:

Initialize the project with `npm link`

```bash
>ccsort <option(s)> <file>
```

> **_NOTE:_** Removed duplicates whilst sorting for merge and quick sort because it doesn't require any extra computational complexity. Used 2 pointer approach for removing duplicates after sorting.
