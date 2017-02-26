class Api::JointsController < ApplicationController
  def home
    joints = Joint.all
    render json: joints,
           each_serializer: JointsSerializer,
           root: false
  end
end
