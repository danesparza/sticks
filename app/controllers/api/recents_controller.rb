class Api::RecentsController < ApplicationController
  def show
    recent = Recent.find(1)

    render json: recent.queue,
           root: false
  end

  def add
    recent = Recent.find(1)
    toAdd = params[:id]

    recent.queue.unshift(toAdd)
    if recent.save
      render json: recent.queue,
             root: false
    end

    # if recent.update_attributes(params[:queue])
    #   render json: recent.queue
    # end
  end

end
