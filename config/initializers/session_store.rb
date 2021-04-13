if Rails.env == "production"
    Rails.application.config.session_store :cookie_store, key: "_adminor", domain: "forkie-web.heroku.com"
else 
    Rails.application.config.session_store :cookie_store, key: "_adminor"
end