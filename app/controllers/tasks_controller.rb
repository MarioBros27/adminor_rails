
class TasksController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :find_task, only: [:show, :update, :destroy]
    def index
        @tasks = Task.all 
        render json: @tasks
    end
    def show
        render json: @task
    end
    def create
        @task = Task.new(task_params)
        if @task.save
            render json: @task
        else
            render json:{ error: 'Unable to create task.'}, status: 400
        end
    end
    def update
        if @task
            @task.update(task_params)
            render json: {message: 'task successfully updated'}, status: 200
        else
            render json:{ error: 'Unable to update task.'}, status: 400
        end
    end
    def destroy
        if @task
            @task.destroy
            render json: {message: 'task successfully deleted'}, status: 200
        else
            render json:{ error: 'Unable to destroy task.'}, status: 400
        end
    end
    private

    def task_params
        params.require(:task).permit(:name,:due_date,:done,:project_id)
    end
    def find_task
        @task = Task.find(params[:id])
    end
end