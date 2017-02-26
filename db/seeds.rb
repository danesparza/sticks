# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

def create_joint_and_pieces
  joint_1 = Joint.create(
    name: 'End to Middle',
    description: 'This is an end-to-middle joint. Use it to build cool stuff.'
  )

  piece_1 = Piece.create(name: 'End piece', joint: joint_1)
  piece_2 = Piece.create(name: 'Middle piece', joint: joint_1)


  joint_2 = Joint.create(
    name: 'Middle to Middle',
    description: 'This is a middle-to-middle joint. Use it to build more cool stuff.'
  )

  piece_3 = Piece.create(name: 'First middle piece', joint: joint_2)
  piece_4 = Piece.create(name: 'Second middle piece', joint: joint_2)
end

create_joint_and_pieces()
