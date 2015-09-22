module Api
  module V1
    class EventsController < ApplicationController

      def show
        response = Response.new("param1", "param2")
        render json: response
      end

      private
        class Response
          def initialize(param1, param2)
            @param1 = param1
            @param2 = param2
          end
          attr_accessor :param1, :param2
        end

    end
  end
end
