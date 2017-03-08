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

class Joint < ActiveRecord::Base
  enum joint_type: [ :end_to_end, :end_to_middle, :middle_to_middle ]

  has_many :pieces
end
