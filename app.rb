require "sinatra"
require "sinatra/activerecord"

set :database, "sqlite3:samthsizer.db"

get "/" do
  erb :index
  end