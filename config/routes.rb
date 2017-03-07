Rails.application.routes.draw do
  root 'joints#home'
  get '/joints/:id', to: 'joints#show'

  namespace :api do
    get '/joints', to: 'joints#home'
    get '/joints/:id', to: 'joints#show'
    get '/joints/filter/:type', to: 'joints#filter'

    get '/recents/show', to: 'recents#show'
    get '/recents/add/:id', to: 'recents#add'
  end
end
