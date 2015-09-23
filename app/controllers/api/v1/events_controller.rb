module Api
  module V1
    class EventsController < ApplicationController

      def index
        data = { data: [
          { author: 'Author1', text: 'This is one comment' },
          { author: 'author2', text: 'This is two comment' }
        ]}
        render json: data
      end

      def index_temp
        events = []
        events = Event.all if params[:keyword].blank?

        if params[:keyword].present?
          keyword = params[:keyword]
          begin
            events = Event.show_index(keyword)
            events = find_by_keyword(keyword) if events.length == 0
          rescue
            events = find_by_keyword(keyword)
          end
        end

        response_events = []
        oldest = nil
        newest = nil

        days = Hash.new { |hash, key| hash[key] = Hash.new(&hash.default_proc) }
        week_array = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        week_array.each do |day|
          for number in 0..23
            hash = days[day][number] = "0"
          end
        end

        for event in events
          next if event.started_at.blank?
          next if Time.zone.now.next_year < event.started_at

          next if event.started_at_day_of_the_week.blank?
          next if event.started_at_hour.blank?

          next if days[event.started_at_day_of_the_week].blank?
          next if days[event.started_at_day_of_the_week][event.started_at_hour].blank?

          oldest = event.started_at if oldest.blank? || event.started_at < oldest
          newest = event.started_at if newest.blank? || newest < event.started_at

          temp_count = days[event.started_at_day_of_the_week][event.started_at_hour].to_i
          temp_count += 1
          days[event.started_at_day_of_the_week][event.started_at_hour] = temp_count.to_s

          response_events << event
        end

        length = response_events.length
        oldest = oldest.strftime("%Y-%m-%d") if oldest.present?
        newest = newest.strftime("%Y-%m-%d") if newest.present?
        information = Information.new(length, oldest, newest, keyword)

        top_array = []
        week_array.each do |day|
          days[day].each do |key, value|
            top_array << value
          end
        end
        top_array.sort!
        array_length = top_array.length

        week_array.each do |day|
          days[day].each do |key, value|
            days[day][key] = top_array.index(value) * 100 / array_length
          end
        end

        data = Data.new(information, days)
        response = Response.new(data)
        render json: response
      end

      private
        class Response
          def initialize(data)
            @data = data
          end
          attr_accessor :data
        end

        class Data
          def initialize(information, days)
            @information = information
            @days = days
          end
          attr_accessor :information, :days
        end

        class Information
          def initialize(length, oldest, newest, keyword)
            @length = length
            @oldest = oldest
            @newest = newest
            @keyword = keyword
          end
          attr_accessor :length, :oldest, :newest, :keyword
        end

        def find_by_keyword(keyword)
          keyword = "%#{escape_like(keyword)}%"
          search_query = 'title like ? or catchtext like ? or description like ? or adress like ? or place like ?'
          @events = Event.where(search_query, keyword, keyword, keyword, keyword, keyword)
        end

        def escape_like(string)
          string.gsub(/[\\%_]/){|m| "\\#{m}"}
        end

    end
  end
end
