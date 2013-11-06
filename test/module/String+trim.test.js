// Copyright Romain Francez and other string contributors.
//
// This file is part of string.
//
// string is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License.
//
// string is distributed in the hope that it will be useful,
// but WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
// NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE. See the GNU General Public License
// for more details.
//
// You should have received a copy of the GNU General Public License
// along with string.  If not, see <http://www.gnu.org/licenses/>.

(function () {
  'use strict';

  require('../../');

  var
    defaults = ' \u0009\u000a\u000d\u0000\u000b',
    hello = 'hello';

  exports.testTrimDefault = function (test) {
    test.expect(4);
    test.strictEqual(''.trim(), '');
    test.strictEqual((' \t\n' + hello + '\r\0\x0b').trim(), hello);
    test.strictEqual(('      ' + hello + ' ').trim(), hello);
    test.strictEqual((' ' + hello + ' world ').trim(), hello + ' world');
    test.done();
  };

  exports.testTrimString = function (test) {
    test.expect(1);
    test.strictEqual(hello.trim(defaults), hello.trim());
    test.done();
  };
  
  exports.testTrimRight = function (test) {
    test.expect(2);
    test.strictEqual((hello + ' ').trim(defaults, String.RIGHT),
                     (' ' + hello + ' ').trim());
    test.strictEqual((' ' + hello + ' ').rtrim(),
                    (' ' + hello + ' ').trim(defaults, String.RIGHT));
    test.done();
  };

  exports.testTrimLeft = function (test) {
    test.expect(2);
    test.strictEqual((' ' + hello).trim(defaults, String.LEFT),
                     (' ' + hello + ' ').trim());
    test.strictEqual(' ' + hello + ' '.ltrim(),
                     ' ' + hello + ' '.trim(defaults, String.LEFT));
    test.done();
  };

  exports.testTrimArray = function (test) {
    test.expect(2);
    test.strictEqual(hello.trim(['e', 'h', 'o']), hello.trim('heo'));
    test.strictEqual(hello.trim(['eh', 'o']), hello.trim(['e', 'h', 'o']));
    test.done();
  };

  exports.testTrimError = function (test) {
    test.expect(3);
    test.throws(function () {
      hello.trim({});
    }, /characters/);
    test.throws(function () {
      hello.trim(defaults, {});
    }, /type.*ends/);
    test.throws(function () {
      hello.trim(defaults, 34);
    }, /value.*ends/);
    test.done();
  };

}());
