// Copyright 2013 Romain Francez and other string contributors.
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

/*jshint bitwise: false */

/**
 * String object.
 * @external String
 */

/**
 * @file Improved trim functions.
 * @author Romain Francez
 *   {@link https://github.com/romainfrancez|@romainfrancez}
 */
(function () {
  'use strict';

  var
    getDefaultCharacters,
    getDefaultEnds;

  /**
   * @constant {Number} LEFT
   * @static
   * @readonly
   * @memberof external:String
   */
  String.LEFT = 1;
  /**
   * @constant {Number} RIGHT
   * @static
   * @readonly
   * @memberof external:String
   */
  String.RIGHT = 2;
  /**
   * @constant {Number} BOTH
   * @static
   * @readonly
   * @memberof external:String
   */
  String.BOTH = 3;

  /**
   * Validates and converts the provided characters set.
   * Characters set is converted to an object to ensure
   * O(1) complexity in V8 for the trim function.
   * Complexity is O(n).
   * @param {String|String[]}
   *   [characters]
   *   The characters to validate and convert
   * @returns {Object}
   * @throws {Error}
   */
  getDefaultCharacters = function (characters) {
    var
      charactersObject = {},
      i,
      l,
      typeofCharacters = typeof characters;
  
    if (characters === undefined || characters === null) {
      characters = ' \u0009\u000a\u000d\u0000\u000b'; // ' \t\n\r\0\x0b'
    } else if (typeofCharacters === 'object' &&
               characters.constructor === Array) {
      characters = characters.join('');
    } else if (typeofCharacters !== 'string') {
      throw new Error('Wrong type for \'characters\' parameter. Must be a ' +
        'string or string array. Got \'' + typeof characters + '\'' +
        (typeofCharacters === 'object' ?
          ' (' + characters.constructor.name + ')' :
          ''));
    }

    for (i = 0, l = characters.length; i < l; i+= 1) {
      charactersObject[characters[i]] = true;
    }

    return charactersObject;
  };

  /**
   * Validates the ends option.
   * @param {external:String.LEFT|external:String.RIGHT|external:String.BOTH}
   *   [ends]
   * @returns {external:String.LEFT|external:String.RIGHT|external:String.BOTH}
   * @throws {Error}
   */
  getDefaultEnds = function (ends) {
    if (ends === undefined || ends === null) {
      ends = String.BOTH;
    } else if (typeof ends !== 'number') {
      throw new Error('Wrong type for \'ends\' parameter. Must be one of ' +
        'String.LEFT, String.RIGHT, String.BOTH. Got \'' + typeof ends + '\'');
    } else if (ends !== String.LEFT &&
               ends !== String.RIGHT &&
               ends !== String.BOTH) {
      throw new Error('Wrong value for \'ends\' parameter. Must be one of ' +
        'String.LEFT, String.RIGHT, String.BOTH. Got \'' + ends + '\'');
    }

    return ends;
  };

  /**
   * Trims the current string with the characters
   * provided and at the ends specified.
   * Complexity is O(n + m) on V8;
   * n length of the string, m length of characters.
   * Regular expressions would be too heavy as they cannot be cached.
   * @function external:String#trim
   * @this external:String
   * @param {external:String|external:String[]}
   *   [characters=\u0020\t\n\r\0\x0b]
   *   The characters to trim
   * @param {external:String.LEFT|external:String.RIGHT|external:String.BOTH}
   *   [ends={@link external:String.BOTH}]
   * @returns {external:String}
   * @throws {Error}
   * @example ' hello world '.trim(); // 'hello world'
   * @example 'hi!'.trim(['!']); // 'hi';
   * @example 'foo bar'.trim(' of'); // 'bar';
   */
  String.prototype.trim = function (characters, ends) {
    var
      trim = true,
      b = 0,
      e = this.length - 1;
  
    if (e < 0) {
      return this;
    }
  
    characters = getDefaultCharacters(characters);
    ends = getDefaultEnds(ends);
  
    while (trim && b <= e) {
      trim = false;
      if (ends & String.LEFT && characters[this[b]] !== undefined) {
        b += 1;
        trim = true;
      }
      if (ends & String.RIGHT && characters[this[e]] !== undefined) {
        e -= 1;
        trim = true;
      }
    }
  
    return this.substr(b, e - b + 1);
  };

  /**
   * Trims the current string on the left end
   * with the characters provided.
   * @function external:String#ltrim
   * @this external:String
   * @param {external:String|external:String[]}
   *   [characters=\u0020\t\n\r\0\x0b]
   *   The characters to trim
   * @returns {external:String}
   * @throws {Error}
   * @see {@link external:String#trim}
   * @example ' hello world '.ltrim(); // 'hello world '
   * @example 'hi!'.ltrim(['!']); // 'hi!';
   */
  String.prototype.ltrim = function (characters) {
    return this.trim(characters, String.LEFT);
  };

  /**
   * Trims the current string on the right end
   * with the characters provided.
   * @function external:String#rtrim
   * @this external:String
   * @param {external:String|external:String[]}
   *   [characters=\u0020\t\n\r\0\x0b]
   *   The characters to trim
   * @returns {external:String}
   * @throws {Error}
   * @see {@link external:String#trim}
   * @example ' hello world '.rtrim(); // ' hello world'
   * @example 'hi!'.rtrim(['!']); // 'hi';
   */
  String.prototype.rtrim = function (characters) {
    return this.trim(characters, String.RIGHT);
  };

}());
