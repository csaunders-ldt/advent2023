def part1(input):
    return max(sum(int(l) for l in e.split('\n')) for e in input.split('\n\n'))

def part2(input):
    elves = [sum(int(l) for l in e.split('\n')) for e in input.split('\n\n')]
    return sum(sorted(elves)[-3:])
