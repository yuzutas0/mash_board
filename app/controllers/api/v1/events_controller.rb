module Api
  module V1
    class EventsController < ApplicationController

      def show
        keyword = params[:keyword] if params[:keyword].present?
        events = Event.all # todo: search by keyword

        length = events.length
        oldest = nil
        newest = nil

        days = Hash.new { |hash, key| hash[key] = Hash.new(&hash.default_proc) }
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].each do |day|
          for number in 0..23
            hash = days[day][number] = "0"
          end
        end

        for event in events
          oldest = event.started_at if oldest.blank? || event.started_at < oldest
          newest = event.started_at if newest.blank? || newest < event.started_at
          if event.started_at_day_of_the_week.present? && event.started_at_hour.present?
            temp_count = days[event.started_at_day_of_the_week][event.started_at_hour].to_i
            temp_count += 1
            days[event.started_at_day_of_the_week][event.started_at_hour] = temp_count.to_s
          end
        end

        oldest = oldest.strftime("%Y-%m-%d") if oldest.present?
        newest = newest.strftime("%Y-%m-%d") if newest.present?
        information = Information.new(length, oldest, newest, keyword)

        response = Response.new(information, days)
        render json: response
      end

      private
        class Response
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

    end
  end
end
