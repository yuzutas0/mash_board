class Event < ActiveRecord::Base
  include SearchableEvent

	def self.create_index
		self.__elasticsearch__.client = Elasticsearch::Client.new host: ENV["ELASTIC_SEARCH_HOST_PORT"]
		self.__elasticsearch__.client.indices.delete index: self.index_name rescue nil
		self.create_index! force: true
		self.__elasticsearch__.import
	end

  def self.show_index(query)
    response = self.search(query).records
  end
end
