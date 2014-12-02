require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'sprockets/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module CommissionToday
  class Application < Rails::Application
    # Don't generate RSpec tests for views and helpers.
    config.generators do |g|

      g.test_framework :rspec
      g.view_specs false
      g.helper_specs false
    end

    # Tell Internet Explorer to use compatibility mode.
    # 'edge' mode tells Internet Explorer to display content in the highest mode available.
    # 'chrome' mode is for when Internet Explorer has the Google Chrome Frame plug-in installed.
    # Note that Google Chrome Frame was retired in Jan. 2014, so this is only for legacy systems.
    # More info at http://blog.chromium.org/2013/06/retiring-chrome-frame.html
    config.action_dispatch.default_headers = { 'X-UA-Compatible' => 'IE=edge,chrome=1' }
  end
end
