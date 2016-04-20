require "sinatra"


get "/" do
  erb :index
end

get "/callback.erb" do
  erb :callback
end