class Api::PiecesController < ApplicationController
  def add_to_recents
    piece = Piece.find params[:id]
    piece.queued_at = DateTime.now

    if piece.save
      render_json_message(:ok)
    end
  end

  def get_recent_pieces
    recent = Piece.all
                  .where("queued_at IS NOT NULL")
                  .order(queued_at: :desc)
                  .first(10)

     render json: recent,
            root: false
  end
end
