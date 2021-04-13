Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: 'home#index'
  resources :sessions, only: [:create]
  resources :registrations, only: [:create]

  delete :logout, to: "sessions#logout"
  get :logged_in, to: "sessions#logged_in"
  
  get '*path', to: 'home#index', via: :all
end
