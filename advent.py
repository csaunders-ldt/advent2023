from glob import glob
from pathlib import Path
from re import match
from importlib import import_module

files = glob('day*/solve.py')
files.sort(key=lambda f: int(match(r'day(\d+)[\\\/]*solve.py', f).group(1)))
file = files[-1]
path = file[:-3].replace('\\', '.').replace('/', '.')
print(path)
import_module(path)
