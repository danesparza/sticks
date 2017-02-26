# == Schema Information
#
# Table name: pieces
#
#  id         :integer          not null, primary key
#  joint_id   :integer
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'test_helper'

class PieceTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
