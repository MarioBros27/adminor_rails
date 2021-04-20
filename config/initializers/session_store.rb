if Rails.env == "production"
    Rails.application.config.session_store :cookie_store, key: "_adminor", domain: "adminor.herokuapp.com"
else 
    Rails.application.config.session_store :cookie_store, key: "_adminor"
end