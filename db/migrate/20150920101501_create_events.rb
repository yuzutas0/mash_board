class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.integer :source_id, null: false
      t.string :source_event_id, null: false
      t.string :title, null: false
      t.text :catchtext
      t.text :description
      t.text :detail_url, null: false
      t.datetime :started_at
      t.datetime :ended_at
      t.text :adress
      t.text :place
      t.string :lat
      t.string :lon
      t.datetime :source_updated_at, null: false
      t.string :stared_at_day_of_the_week
      t.integer :started_at_hour

      t.timestamps null: false

      t.index [:source_id, :source_event_id], :unique => true
    end
  end
end
