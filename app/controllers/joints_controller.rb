class JointsController < ApplicationController
  def home
  end

  def show
    @joint = Joint.find params[:id]
    @pieces = @joint.pieces
  end
end
