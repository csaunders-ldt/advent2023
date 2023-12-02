require 'json'

files = Dir.glob('day*/solve.rb')
sorted = files.sort_by { |file| file.split('/')[0].split('day')[1].to_i }
sorted = sorted.filter { |file| file.split('/')[0].split('day')[1].to_s === ARGV[0] } if ARGV[0]
load sorted[0]

path = sorted[0].split('/')[0]
solutions = JSON.parse(File.read("#{path}/solutions.json"))

input = File.read("#{path}/input.txt")
part1_guess = part1(input)
solution = solutions['part1']['correctSolution'].to_s
raise "Part 1 incorrect. Expected #{solution} got #{part1_guess}" unless part1_guess.to_s == solution
puts "Part 1 correct!"

input_2 = File.read("#{path}/input.txt")
part2_guess = part2(input_2)
solution_2 = solutions['part2']['correctSolution'].to_s
raise "Part 2 incorrect. Expected #{solution_2} got #{part2_guess}" unless part2_guess.to_s == solution_2
puts "Part 2 correct!"
