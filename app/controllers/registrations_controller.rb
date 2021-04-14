
class RegistrationsController < ApplicationController
    def create
        
            # logger.debug "is google? #{is_google}"
        if params["user"]["is_google"]
            user = User.create!(
                email: params["user"]["email"],

                password: "jNJKNJANSJNDJNnanjak1891h28",
                password_confirmation: "jNJKNJANSJNDJNnanjak1891h28",
                is_google: params["user"]["is_google"]
            )
        else
            user = User.create!(
                email: params["user"]["email"],
                password: params["user"]["password"],
                password_confirmation: params["user"]["password_confirmation"],
                is_google: params["user"]["is_google"]
            )
        end
        

        if user 
            session[:user_id] = user.id
            render json: {
                status: :created,
                user: user
            }
        else 
            return head 500
        end
    end
end