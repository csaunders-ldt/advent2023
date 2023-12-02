require 'test/unit'
extend Test::Unit::Assertions

def part1(input)
    input.each_line.with_index.map do |line, i|
        next 0 if line.scan(/\d+ red/).map(&:to_i).max > 12
        next 0 if line.scan(/\d+ green/).map(&:to_i).max > 13
        next 0 if line.scan(/\d+ blue/).map(&:to_i).max > 14
        i + 1
    end.reduce(:+)
end
    

def part2(input)
    input.each_line.map do |line, i|
        ['red', 'green', 'blue'].map do |color|
            line.scan(/\d+ #{color}/).map(&:to_i).max
        end.reduce(:*)
    end.reduce(:+)
end

assert_equal 8, part1(File.read("#{__dir__}/test1.txt"))
assert_equal 2286, part2(File.read("#{__dir__}/test2.txt"))
