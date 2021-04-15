class ProjectsController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :find_project, only: [:show, :update, :destroy]
    def index
        @projects = Project.all 
        render json: @projects
    end
    def show
        render json: @project.as_json(include: [:tasks])

    end
    def create
        @project = Project.new(project_params)
        
        if @project.save
            render json: @project
        else
            render json:{ error: 'Unable to create project.'}, status: 400
        end
    end
    def update
        if @project
            @project.update(project_params)
            
            render json: {message: 'Project successfully updated'}, status: 200
        else
            render json:{ error: 'Unable to update project.'}, status: 400
        end
    end
    def destroy
        if @project
            @project.destroy
            render json: {message: 'Project successfully deleted'}, status: 200
        else
            render json:{ error: 'Unable to destroy project.'}, status: 400
        end
    end
    private
    
    def project_params
        params.require(:project).permit(:name,:due_date, :user_id)
    end
    def find_project
        @project = Project.find(params[:id])
    end
end