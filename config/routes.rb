Rails.application.routes.draw do
  root 'joints#home'

  namespace :api do
    get '/joints', to: 'joints#home'
  end
end
