class Api::JointsController < ApplicationController
  def home
    joints = Joint.all
    render json: joints,
           each_serializer: JointsSerializer,
           root: false
  end

  def show
    joint = Joint.find params[:id]
    render json: joint,
           each_serializer: JointsSerializer,
           root: false
  end
end
