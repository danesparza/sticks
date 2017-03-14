# == Schema Information
#
# Table name: pieces
#
#  id         :integer          not null, primary key
#  joint_id   :integer
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  queued_at  :datetime
#

class Piece < ActiveRecord::Base
  belongs_to :joint
end
