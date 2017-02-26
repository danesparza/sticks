class CreateJoints < ActiveRecord::Migration
  def change
    create_table :joints do |t|
      t.string :name
      t.text :description

      t.timestamps null: false
    end
  end
end
