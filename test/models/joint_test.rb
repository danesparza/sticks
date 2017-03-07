# == Schema Information
#
# Table name: joints
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  joint_type  :integer
#

require 'test_helper'

class JointTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
