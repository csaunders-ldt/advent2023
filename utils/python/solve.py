import json
import inspect
import os
from pathlib import Path
import re
import sys
from urllib import request


def solve(part1, part2, test1, test2):
    abs_path = os.path.abspath((inspect.stack()[1])[1])
    dir = os.path.dirname(abs_path)
    if test1:
        test_1_answer = part1(open(dir + "\\test1.txt").read())
        if test_1_answer != test1:
            raise Exception(f"Wrong answer! Expected {test1}, got {test_1_answer}")
    input_text = open(dir + "\\input.txt").read().strip()
    attempt(part1(input_text), 1, dir)
    if not part2:
        return
    if test2:
        test_2_answer = part2(open(dir + "\\test2.txt").read())
        if test_2_answer != test2:
            raise Exception(f"Wrong answer! Expected {test2}, got {test_2_answer}")
    attempt(part2(input_text), 2, dir)


def get_session():
    envFile = Path(os.path.dirname(os.path.abspath(__file__))).parent.parent.joinpath(
        ".env"
    )
    with open(envFile) as f:
        return f.read().split("=")[1].split("\n")[0]


def check_solution(answer, day, part):
    url = f"https://adventofcode.com/2023/day/{day}/answer"
    query = f"level={part}&answer={answer}"
    print(query)
    print(get_session())
    headers = {
        "cookie": f"session={get_session()}",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    req = request.Request(url, query.encode("utf-8"), headers=headers)
    resp = request.urlopen(req)
    return "not the right answer" not in resp.read().decode("utf-8")

def attempt(solution, part, dir):
    solutions = json.loads(open(dir + "/solutions.json").read())
    solution_part = solutions[f"part{part}"]

    if solution_part["correctSolution"]:
        if solution_part["correctSolution"] == solution:
            print(f"Part {part} correct!")
            return True
        else:
            raise Exception(
                f"Wrong answer! Expected {solution_part['solution']}, got {solution}"
            )

    if solution in solution_part["attemptedSolutions"]:
        print("Already attempted this solution!")
        return False

    solution_part["attemptedSolutions"].append(solution)
    day = re.match(r".*day(\d+).*", dir).group(1)
    if check_solution(solution, day, part):
        solution_part["correctSolution"] = solution
        print("Correct!")
    else:
        print(f"Wrong answer ({solution}!")

    with open(Path(dir).joinpath("solutions.json"), "w") as outfile:
        outfile.write(json.dumps(solutions, indent=4))

    return solution_part["correctSolution"] == solution
