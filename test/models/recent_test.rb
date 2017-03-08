# == Schema Information
#
# Table name: recents
#
#  id         :integer          not null, primary key
#  queue      :integer          default("{}"), is an Array
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'test_helper'

class RecentTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
