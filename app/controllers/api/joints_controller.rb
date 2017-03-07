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

  def filter
    type = params[:type]
    output = nil

    if type == "end_to_end"
      output = Joint.end_to_end
    elsif type == "end_to_middle"
      output = Joint.end_to_middle
    elsif type == "middle_to_middle"
      output = Joint.middle_to_middle
    end

    render json: output,
           each_serializer: JointsSerializer,
           root: false
  end
end
