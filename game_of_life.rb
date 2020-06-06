module GameOfLife
  class Board
    include Enumerable
    attr_reader :size

    # @matrix is array of arrays.
    # members of arrays are booleans - initialy 'false'
    def initialize(size)
      @size = size
      @matrix = Array.new(size) { Array.new(size) { false } }
    end

    def each
      matrix.each { |row| yield(row) }
    end

    def [](arg)
      matrix[arg]
    end

    def enable(cell_coordinates)
      cell_coordinates.each do |(x_coord, y_coord)|
        matrix[y_coord][x_coord] = true
      end
    end

    def disable(cell_coordinates)
      cell_coordinates.each do |(x_coord, y_coord)|
        matrix[y_coord][x_coord] = false
      end
    end

    private

    attr_reader :matrix
  end

  class BoardToString
    PICTURES = { true => 'X', false => '.' }
    private_constant :PICTURES

    def initialize(board)
      @board = board
    end

    def call
      board.map do |line|
        line.map { |x| PICTURES[x] }.join(' ')
      end.join("\n")
    end

    private

    attr_reader :board

  end

  class DetermineNeighbourCoordinates
    def initialize(x_coord:, y_coord:, board_size:)
      @x_coord    = x_coord
      @y_coord    = y_coord
      @board_size = board_size
    end

    def call
      left_x   = rotate_if_needed(x_coord - 1)
      right_x  = rotate_if_needed(x_coord + 1)
      top_y    = rotate_if_needed(y_coord - 1)
      bottom_y = rotate_if_needed(y_coord + 1)

      [
        [left_x, top_y], [x_coord, top_y], [right_x, top_y],
        [left_x, y_coord], [right_x, y_coord],
        [left_x, bottom_y], [x_coord, bottom_y], [right_x, bottom_y]
      ]
    end

    private

    attr_reader :x_coord, :y_coord, :board_size

    def rotate_if_needed(value)
      if value < 0
        board_size - 1
      elsif value >= board_size
        0
      else
        value
      end
    end
  end

  class DetermineDecisions
    Result = Struct.new(:cells_to_enable, :cells_to_disable)

    def initialize(board)
      @board = board
    end

    # TODO: add a special class 'ArrayOfCoordinatePairs' ?
    def call
      cells_to_enable = []
      cells_to_disable = []

      board.each_with_index do |row, y_coord|
        row.each_with_index do |cell, x_coord|
          neighbour_coordinates =
            DetermineNeighbourCoordinates.new(x_coord: x_coord,
                                              y_coord: y_coord,
                                              board_size: board.size).call
          if cell && needs_disable?(neighbour_coordinates)
            # TODO: definitely need to add class 'Cell' instead of operating on coordinate_pairs:
            cells_to_disable << [x_coord, y_coord]
          elsif needs_enable?(neighbour_coordinates)
            cells_to_enable << [x_coord, y_coord]
          end
        end
      end

      Result.new(cells_to_enable, cells_to_disable)
    end

    private

    attr_reader :board

    def needs_disable?(neighbour_coordinates)
      live_neighbours = count_live_cells(neighbour_coordinates)
      live_neighbours < 2 || live_neighbours > 3
    end

    def needs_enable?(neighbour_coordinates)
      count_live_cells(neighbour_coordinates) == 3
    end

    def count_live_cells(coordinates)
      coordinates.count { |(x_coord, y_coord)| board[y_coord][x_coord] }
    end
  end

  class MainLoop

    def initialize(board)
      @board = board
    end

    def step
      decisions = DetermineDecisions.new(board).call
      board.enable(decisions.cells_to_enable)
      board.disable(decisions.cells_to_disable)
      puts(BoardToString.new(board).call)
    end

    private

    attr_reader :board
  end
end

#   . . . . .
#   . . x . .
#   . . . x .
#   . x x x .
#   . . . . .

board = GameOfLife::Board.new(20)
board.enable([[2,1],[3,2],[1,3],[2,3],[3,3]])
puts(GameOfLife::BoardToString.new(board).call)

ml = GameOfLife::MainLoop.new(board)
ml.step
100.times do |x|
  system('clear')
  ml.step
  sleep(0.2)
end

# TODO: add a special class 'CoordinatePair' ?
# TODO: add a special class 'Cell' - with three attributes (on/off value + plux two coords) ?
#
# board.each_with_index do |row, y_coord|
#   row.each_with_index do |cell, x_coord|
#     neighbour_coordinates = DetermineNeighbourCoordinates(x_coord, y_coord)
#   end
# end

# res = GameOfLife::DetermineNeighbourCoordinates.new(x_coord: 0, y_coord: 0, board_size: 3).call
# pp res

# decisions = DetermineDecisions.new(board).call

# bb = [[false, true, false],[false, false, true]]
# puts GameOfLife::BoardToString.new(bb).call
