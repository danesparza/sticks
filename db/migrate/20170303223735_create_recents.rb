class CreateRecents < ActiveRecord::Migration
  def change
    create_table :recents do |t|
      t.text :queue, array: true, default: []
      t.timestamps null: false
    end
  end
end
