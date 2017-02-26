class JointsSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :description

  has_many :pieces, each_serializer: PiecesSerializer
end
