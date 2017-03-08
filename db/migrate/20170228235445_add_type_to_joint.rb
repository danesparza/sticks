class AddTypeToJoint < ActiveRecord::Migration
  def change
    add_column :joints, :joint_type, :integer
  end
end
