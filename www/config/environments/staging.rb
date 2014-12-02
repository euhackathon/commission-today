Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # This will password-protect your staging site so that search engines can't
  # index it. If they were to index it, they would penalize your site for
  # having duplicate content across two different sites.
  # The username and password are stored in environment variables that you
  # should set on your staging server. If you're deploying on Heroku, read this
  # article to learn how to set environment (also called config) variables:
  # https://devcenter.heroku.com/articles/config-vars
  config.middleware.use '::Rack::Auth::Basic' do |u, p|
    [u, p] == [ENV['STAGING_USER'], ENV['STAGING_PASSWORD']]
  end

  # --------------------------------------------------------------------------
  # CACHING SETUP FOR RACK:CACHE AND MEMCACHIER ON HEROKU
  # https://devcenter.heroku.com/articles/rack-cache-memcached-rails31
  # ------------------------------------------------------------------

  config.serve_static_assets = true

  # Generate digests for assets URLs.
  config.assets.digest = true

  config.action_controller.perform_caching = true

  config.cache_store = :dalli_store
  client = Dalli::Client.new((ENV['MEMCACHIER_SERVERS'] || '').split(','),
                             username: ENV['MEMCACHIER_USERNAME'],
                             password: ENV['MEMCACHIER_PASSWORD'],
                             failover: true,
                             socket_timeout: 1.5,
                             socket_failure_delay: 0.2,
                             value_max_bytes: 10_485_760)
  config.action_dispatch.rack_cache = {
    metastore:   client,
    entitystore: client
  }
  config.static_cache_control = 'public, max-age=2592000'
  # --------------------------------------------------------------------------

  # Code is not reloaded between requests.
  config.cache_classes = true

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local = false

  # Compress JavaScripts and CSS.
  config.assets.js_compressor  = :uglifier
  # NOTE: If the sass-rails gem is included it will automatically
  # be used for CSS compression if no css_compressor is specified.
  config.assets.css_compressor = :sass

  # Do not fallback to assets pipeline if a precompiled asset is missed.
  config.assets.compile = false

  # `config.assets.version` and `config.assets.precompile` have moved to config/initializers/assets.rb

  # Defaults to nil and saved in location specified by config.assets.prefix
  # config.assets.manifest = YOUR_PATH

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = "X-Sendfile" # for apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for nginx

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  # config.force_ssl = true

  # Set to :debug to see everything in the log.
  # config.log_level = :info

  # Prepend all log lines with the following tags.
  # config.log_tags = [ :subdomain, :uuid ]

  # Use a different logger for distributed setups.
  # config.logger = ActiveSupport::TaggedLogging.new(SyslogLogger.new)

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.action_controller.asset_host = "http://assets.example.com"

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners.
  config.active_support.deprecation = :notify

  # Disable automatic flushing of the log to improve performance.
  # config.autoflush_log = false

  # Use default logging formatter so that PID and timestamp are not suppressed.
  config.log_formatter = ::Logger::Formatter.new
end
