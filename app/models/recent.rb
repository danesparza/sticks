# == Schema Information
#
# Table name: recents
#
#  id         :integer          not null, primary key
#  queue      :integer          default("{}"), is an Array
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Recent < ActiveRecord::Base
end
