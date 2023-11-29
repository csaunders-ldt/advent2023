files = Dir.glob('day*/solve.rb')
sorted = files.sort_by { |file| file.split('/')[0].split('day')[1].to_i }
load sorted[0]

path = sorted[0].split('/')[0]

input = File.read("#{path}/input.txt")
solution = File.read("#{path}/solutions.txt").split("\n")[-1]
part1_guess = part1(input)
raise "Part 1 incorrect. Expected #{solution} got #{part1_guess}" unless part1_guess.to_s == solution.to_s
puts "Part 1 correct!"

input_2 = File.read("#{path}/input2.txt")
solution_2 = File.read("#{path}/solutions2.txt").split("\n")[-1]
part2_guess = part2(input_2)
raise "Part 2 incorrect. Expected #{solution_2} got #{part2_guess}" unless part2_guess.to_s == solution_2.to_s
puts "Part 2 correct!"
