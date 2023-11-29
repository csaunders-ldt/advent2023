def part1(input)
  input.split("\n\n").map { |l| l.split("\n").sum(&:to_i) }.max
end
    

def part2(input)
  part2 = input.split("\n\n")
    .map { |l| l.split("\n").sum(&:to_i) }
    .sort.reverse.slice(0, 3).sum
end