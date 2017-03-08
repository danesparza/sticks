# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: "Chicago" }, { name: "Copenhagen" }])
#   Mayor.create(name: "Emanuel", city: cities.first)

def create_joints
  # End to End
  1.upto(10) do |n|
    joint = Joint.create(
      name: "End to End #{n}",
      description: "This is an end-to-end joint. Use it to build cool stuff",
      joint_type: 0
    )
  end

  # End to Middle
  1.upto(10) do |n|
    join = Joint.create(
      name: "End to Middle #{n}",
      description: "This is an end-to-middle joint. Use it to build cool stuff",
      joint_type: 1
    )
  end

  # Middle to Middle
  1.upto(10) do |n|
    join = Joint.create(
      name: "Middle to Middle #{n}",
      description: "This is an middle-to-middle joint. Use it to build cool stuff",
      joint_type: 2
    )
  end
end


def create_pieces
  # Pieces for End to End
  1.upto(20) do |n|
    Piece.create(
      name: "End piece",
      joint: Joint.end_to_end[n % 10]
    )
  end

  # Pieces for Middle to Middle
  1.upto(20) do |n|
    Piece.create(
      name: "Middle piece",
      joint: Joint.middle_to_middle[n % 10]
    )
  end

  # Pieces for End to Middle
  1.upto(10) do |n|
    Piece.create(
      name: "End piece",
      joint: Joint.end_to_middle[n]
    )
    Piece.create(
      name: "Middle piece",
      joint: Joint.end_to_middle[n]
    )
  end
end

def create_recent
  recent = Recent.create(
    queue: []
  )
end

create_joints()
create_pieces()
create_recent()
