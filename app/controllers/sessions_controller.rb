
class SessionsController < ApplicationController
include CurrentUserConcern
def create
    user = User
            .find_by(email: params["user"]["email"])

            if not user 
                return head 404
            else 
                if params["user"]["is_google"]
                    user = user.try(:authenticate, "jNJKNJANSJNDJNnanjak1891h28")
                else
                    user = user.try(:authenticate, params["user"]["password"])
                end
            end
    
    if user 
        session[:user_id] = user.id
        # render json: user.as_json(include: [:projects]).merge({status: :created, logged_in: true})
        render json: {
            status: :created,
            logged_in: true,
            user: user.as_json(include: [:projects])
        }
    else
        return head 422
    end
end

def logged_in
    if @current_user 
        # render json: @current_user.as_json(include: [:projects]).merge({ logged_in: true})
        render json: {
            logged_in: true,
            # user: @current_user
            user:  @current_user.as_json(include: [:projects])
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
