Rails.application.routes.draw do
  root 'joints#home'
  get '/joints/:id', to: 'joints#show'

  namespace :api do
    get '/joints', to: 'joints#home'
    get '/joints/:id', to: 'joints#show'
  end
end
