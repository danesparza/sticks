class Api::RecentsController < ApplicationController
  def show
    recent = Recent.find(1)

    render json: recent.queue,
           root: false
  end

  def add
    recent = Recent.find(1)
    toAdd = Integer(params[:id]) rescue false

    if not toAdd
      render json: recent.queue,
                   root: false
      return
    end


    if recent.queue.include? toAdd
      recent.queue.delete(toAdd)
    end

    recent.queue.unshift(toAdd)

    if recent.queue.length > 10
      recent.queue.pop()
    end

    if recent.save
      render json: recent.queue,
             root: false
    end
  end

end
