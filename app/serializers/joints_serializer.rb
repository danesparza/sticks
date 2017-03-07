class JointsSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :description,
             :type

  has_many :pieces, each_serializer: PiecesSerializer

  def type
    object.joint_type
  end
end
