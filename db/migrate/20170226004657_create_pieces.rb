class CreatePieces < ActiveRecord::Migration
  def change
    create_table :pieces do |t|
      t.belongs_to :joint, index: true
      t.string :name
      t.timestamps null: false
    end
  end
end
