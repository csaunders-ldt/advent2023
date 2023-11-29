points = {'win': 6, 'lose': 0, 'tie': 3}

def result(them, you):
    if you == them:
        return "tie"
    if you == 1:
        return them == 3 and "win" or "lose"
    return you - them == 1 and "win" or "lose"

def to_value(l, r):
    return [ord(l) - ord('A') + 1, ord(r) - ord('X') + 1]

def part1(input):
    scores = [to_value(*l.split(' ')) for l in input.split('\n')]
    return sum(points[result(them, you)] + you for [them, you] in scores)

def get_target_shape(them, desired):
    if desired == 1:
        return them == 1 and 3 or them - 1
    if desired == 3:
        return them == 3 and 1 or them + 1
    return them

points_2 = {3: 6, 1: 0, 2: 3}
def part2(input):
    scores = [to_value(*l.split(' ')) for l in input.split('\n')]
    return sum(points_2[you] + get_target_shape(them, you) for [them, you] in scores)
