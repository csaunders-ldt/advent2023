from glob import glob
from re import match
from importlib import import_module

files = glob('day*/solve.py')
files.sort(key=lambda f: int(match(r'day(\d+)[\\\/]*solve.py', f).group(1)))
file = files[-1]
module = import_module(file[:-3].replace('\\', '.').replace('/', '.'))

part1Answer = open(file[:-8] + 'solutions.txt').read().splitlines()[-1]
part1 = module.part1(open(file[:-8] + 'input.txt').read().strip())
assert part1Answer == str(part1), f'Part 1 failed, expected {part1Answer}, got {part1}'
print('Part 1 passed')

part2Answer = open(file[:-8] + 'solutions2.txt').read().splitlines()[-1]
part2 = module.part2(open(file[:-8] + 'input2.txt').read().strip())
assert part2Answer == str(part2), f'Part 2 failed, expected {part2Answer}, got {part2}'
print('Part 2 passed')