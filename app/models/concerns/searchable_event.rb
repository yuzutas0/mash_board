module SearchableEvent
	extend ActiveSupport::Concern

	included do
		include Elasticsearch::Model
		include Elasticsearch::Model::Callbacks

		# customize the index name
		index_name "event"

		# Set up index configuration and mapping
		settings index: {
			number_of_shards: 1,
			number_of_replicas: 0,
			analysis: {
				filter: {
					pos_filter: {
						type: 'kuromoji_part_of_speech',
						stoptags: ['助詞-格助詞-一般', '助詞-終助詞']
					},
					greek_lowercase_filter: {
						type: 'lowercase',
						language: 'greek'
					}
				},
				tokenizer: {
					kuromoji: {
						type: 'kuromoji_tokenizer'
					},
					ngram_tokenizer: {
						type: 'nGram',
						min_gram: '2',
						max_gram: '3',
						token_chars: ['letter', 'digit']
					}
				},
				analyzer: {
					kuromoji_analyzer: {
						type: 'custom',
						tokenizer: 'kuromoji_tokenizer',
						filter: ['kuromoji_baseform', 'pos_filter', 'greek_lowercase_filter', 'cjk_width']
					},
					ngram_analyzer: {
						tokenizer: "ngram_tokenizer"
					}
				}
			}
		} do
			mapping do
				indexes :id,                  type: 'integer', index: 'not_analyzed'
				indexes :source_id,           type: 'integer', index: 'not_analyzed'
				indexes :source_event_id,     type: 'integer', index: 'not_analyzed'
				indexes :title,               type: 'string',  index: 'analyzed', analyzer: 'kuromoji_analyzer'
				indexes :catchtext,           type: 'string',  index: 'analyzed', analyzer: 'kuromoji_analyzer'
				indexes :description,         type: 'string',  index: 'analyzed', analyzer: 'kuromoji_analyzer'
				indexes :detail_url,          type: 'string',  index: 'not_analyzed'
				indexes :started_at,          type: 'date',    index: 'not_analyzed'
				indexes :ended_at,            type: 'date',    index: 'not_analyzed'
				indexes :adress,              type: 'string',  index: 'analyzed', analyzer: 'kuromoji_analyzer'
				indexes :place,               type: 'string',  index: 'analyzed', analyzer: 'kuromoji_analyzer'
				indexes :lat,                 type: 'string',  index: 'not_analyzed'
				indexes :lon,                 type: 'string',  index: 'not_analyzed'
				indexes :source_updated_at,   type: 'date',    index: 'not_analyzed'
				indexes :created_at,          type: 'date',    index: 'not_analyzed'
				indexes :updated_at,          type: 'date',    index: 'not_analyzed'
			end
		end
	end

	module ClassMethods
		def create_index!(options={})
			client = __elasticsearch__.client
			client.indices.delete index: "event" rescue nil if options[:force]
			client.indices.create index: "event",
			body: {
				settings: settings.to_hash,
				mappings: mappings.to_hash
			}
		end
	end
end
