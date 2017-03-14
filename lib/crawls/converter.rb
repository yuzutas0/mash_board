# encoding: utf-8
class Crawls::Converter

  # rails runner Crawls::Converter.update_event(old_event, new_event)
  def self.update_event(old_event, new_event)
    begin
      old_event.update_attributes!({
                                       :source_id => new_event.source_id,
                                       :source_event_id => new_event.source_event_id,
                                       :title => new_event.title,
                                       :catchtext => new_event.catchtext,
                                       :description => new_event.description,
                                       :detail_url => new_event.detail_url,
                                       :started_at => new_event.started_at,
                                       :ended_at => new_event.ended_at,
                                       :reference_url => new_event.reference_url,
                                       :adress => new_event.adress,
                                       :place => new_event.place,
                                       :lat => new_event.lat,
                                       :lon => new_event.lon,
                                       :source_updated_at => new_event.source_updated_at,
                                       :started_at_day_of_the_week => new_event.started_at_day_of_the_week,
                                       :started_at_hour => new_event.started_at_hour
                                   })
    rescue => e
      puts e.message
    end
  end

  # rails runner Crawls::Converter.get_event(source_id, source_array)
  def self.get_event(source_id, source_array)

    event = Event.new
    event.source_id = source_id

    if [1, 3, 4].include?(source_id)
      event.source_event_id = source_array['event_id']
    elsif source_id == 2
      event.source_event_id = source_array['id']
    end

    event.title = source_array['title']
    event.catchtext = source_array['catch']
    event.description = source_array['description']

    if [1, 3, 4].include?(source_id)
      event.detail_url = source_array['event_url']
    elsif source_id == 2
      event.detail_url = source_array['public_url']
    end

    if [1, 3, 4].include?(source_id) && source_array['started_at'].present?
      event.started_at = source_array['started_at'].in_time_zone
    elsif source_id == 2 && source_array['starts_at'].present?
      event.started_at = source_array['starts_at'].in_time_zone
    end

    if [1, 3, 4].include?(source_id) && source_array['ended_at'].present?
      event.ended_at = source_array['ended_at'].in_time_zone
    elsif source_id == 2 && source_array['ends_at'].present?
      event.ended_at = source_array['ends_at'].in_time_zone
    end

    event.adress = source_array['address']

    if [1, 3, 4].include?(source_id)
      event.place = source_array['place']
    elsif source_id == 2
      event.place = source_array['venue_name']
    end

    event.lat = source_array['lat']

    if [1, 3, 4].include?(source_id)
      event.lon = source_array['lon']
    elsif source_id == 2
      event.lon = source_array['long']
    end

    event.source_updated_at = source_array['updated_at']

    if event.started_at.present?
      event.started_at_day_of_the_week = event.started_at.strftime("%a")
      event.started_at_hour = event.started_at.strftime("%H")
    end

    return event
  end

end


# --------------------------------------------------------------------
# Response Param
# --------------------------------------------------------------------
#
# event
# ┣ [id]：デフォルト
# ┣ [created_at]：デフォルト
# ┣ [updated_at]：デフォルト
# ┣ [source_id]：情報取得元はどのサイトか
#   ┗ 1:ATND, 2:Doorkeeper, 3:Zusaar, 4:Connpass
#
# ┣ [source_event_id] event_id / id：各サイトでのID
# ┣ [title] title：タイトル
# ┣ [catch] catch：キャッチ => サブタイトルのようなもの
# ┣ [description] description：概要
# ┣ [detail_url] event_url / public_url：イベント詳細ページURL
# ┣ [hash_tag] hash_tag：Twitterのハッシュタグ
# ┣ [started_at] started_at / starts_at：イベント開催日時
# ┣ [ended_at] ended_at / ends_at：イベント終了日時
# ┣ [pay_type] pay_type：無料／有料イベント
# ┣ [event_type] event_type：イベント参加タイプ（参加受付/告知のみ）
# ┣ [reference_url] url：参考URL
# ┣ [limit] limit / ticket_limit：定員
# ┣ [adress] address：開催場所
# ┣ [place] place / venue_name：開催会場
# ┣ [lat] lat：開催会場の緯度
# ┣ [lon] lon / long：開催会場の経度
# ┣ [owner_id] owner_id：主催者のID
# ┣ [owner_profile_url] owner_profile_url：主催者のプロフィールURL
# ┣ [owner_nickname] owner_nickname：主催者のニックネーム
# ┣ [owner_twitter_id] owner_twitter_id：主催者のtwitter ID
# ┣ [owner_display_name] owner_display_name：主催者の表示名
# ┣ [accepted] accepted / participants：参加者
# ┣ [waiting] waiting / waitlisted：補欠者
# ┣ [banner] banner：バナー画像
# ┣ [source_published_at] published_at：公開日時
# ┣ [source_updated_at] updated_at：更新日時（＊カラム名が重複する問題）
# ┗ series / group：グループ
#   ┣ [series_id] id
#   ┣ [series_title] title / name
#   ┣ [series_country_code] country_code
#   ┣ [series_logo] logo
#   ┣ [series_description] description
#   ┗ [series_url] url / public_url
