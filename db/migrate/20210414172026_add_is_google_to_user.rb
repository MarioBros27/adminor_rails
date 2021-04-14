class AddIsGoogleToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :is_google, :boolean
  end
end
