
class SessionsController < ApplicationController
include CurrentUserConcern
def create
    user = User
            .find_by(email: params["user"]["email"])

            if not user 
                return head 404
            else 
                user = user.try(:authenticate, params["user"]["password"])
            end
    
    if user 
        session[:user_id] = user.id
        render json: {
            status: :created,
            logged_in: true,
            user: user
        }
    else
        return head 422
    end
end

def logged_in
    if @current_user 
        render json: {
            logged_in: true,
            user: @current_user
        }
    else 
        render json: {
            logged_in: false
        }
    end
end

def logout 
    reset_session
    render json: { status: 200, logged_out: true }
end
end
