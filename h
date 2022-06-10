Last login: Wed Jun  8 22:22:16 on ttys001
Administrators-MacBook-Pro:~ admin$ brew edit librsvg
Editing /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core/Formula/librsvg.rb
Warning: Using vim because no editor was set in the environment.
This may change in the future, so we recommend setting EDITOR,
or HOMEBREW_EDITOR to your preferred text editor.

















class Librsvg < Formula
  desc "Library to render SVG files using Cairo"
  homepage "https://wiki.gnome.org/Projects/LibRsvg"
  url "https://download.gnome.org/sources/librsvg/2.54/librsvg-2.54.3.tar.xz"
  sha256 "66158f2ef46dde260026846c4da102e4a9dd4e5293010f30949c6cc26dd6efe8"
  license "LGPL-2.1-or-later"

  bottle do
    sha256                               arm64_monterey: "95b5d68fd281c2dd6676ac9757987bbe108ec6b17f0166d59fd8289a41769fe5"
    sha256                               arm64_big_sur:  "db9ab70e5eb9fe4e9a9964d3b9bbd39caf1adac22ddbd6d8334e5ccc6f1438fe"
    sha256                               monterey:       "d633c9e47554d0ebb3d716cc58b88f903bf7d0abc4cd7ce8bb2a2166e87917a4"
    sha256                               big_sur:        "066a0a03dcc32114ea0fce74143d58550cf50071cf50f4c29c675d6e6790a8ab"
    sha256                               catalina:       "52106a21b64a99c22de997bd0b00674bfd7e3722c607e85e416f7a674c70189a"
    sha256 cellar: :any_skip_relocation, x86_64_linux:   "1e30a183c2f1612d3316896dd1df40963c9c1fb567eee1a86d89ae9884f9edd6"
  end

  depends_on "gobject-introspection" => :build

