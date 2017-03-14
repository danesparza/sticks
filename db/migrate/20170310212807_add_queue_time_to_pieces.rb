class AddQueueTimeToPieces < ActiveRecord::Migration
  def change
    add_column :pieces, :queued_at, :datetime
  end
end
