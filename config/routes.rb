Rails.application.routes.draw do
  root 'joints#home'
  get '/joints/:id', to: 'joints#show'

  namespace :api do
    get '/joints', to: 'joints#home'
    get '/joints/:id', to: 'joints#show'
    get '/joints/filter/:type', to: 'joints#filter'

    get '/recents', to: 'pieces#get_recent_pieces'
    get '/recents/add/:id', to: 'pieces#add_to_recents'
  end
end
