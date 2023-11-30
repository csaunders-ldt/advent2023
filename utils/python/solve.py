import json;
import inspect;
import os;
import re;
from urllib import request, parse

def get_session():
    with open('../../.env') as f:
        return f.read().split('=')[1]

def check_solution(answer, day, part):
    url=f"https://adventofcode.com/2023/day/${day}/answer"
    query=f"level=${part}&answer=${answer}"
    headers={"cookie": f"session=${get_session()}"}
    req =  request.Request(url, query) # this will make the method "POST"
    resp = request.urlopen(req)
    return not resp.read().decode("utf-8").includes("not the right answer")

def attempt(solution):
    abs_path = os.path.abspath((inspect.stack()[0])[1])
    dir = os.path.dirname(abs_path)
    solutions = json.loads(open(dir + "/solutions.json").read())
    is_part_two = os.path.isfile(dir + "/part_two.py")
    solution_part = solutions['partTwo' if is_part_two else 'partOne']

    if solution_part['correctSolution']:
        if solution_part['solution'] == solution:
            print("Correct!")
            return True
        else:
            raise Exception(f"Wrong answer! Expected {solution_part['solution']}, got {solution}")
    
    if solution in solution_part['attemptedSolutions']:
        print("Already attempted this solution!")
        return False
    
    solution_part['attemptedSolutions'].append(solution)
    day = re.match(r'.*day(\d+).*', dir).group(1)
    if check_solution(solution, day, 2 if is_part_two else 1):
        solution_part['correctSolution'] = solution
        print("Correct!")
        return True
    else:
        print(f"Wrong answer ({solution}!")

    with open(dir + "solution.json", "w") as outfile:
        outfile.write(json.dumps(solutions, indent=4))

    return solution_part['correctSolution'] == solution

    
    