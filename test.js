'use strict'

var test = require('tape').test
var filter = require('./')

test('degenerate', function (t) {
  t.equal(filter()(), true)
  t.equal(filter(undefined)(), true)
  t.equal(filter(null)(), true)
  t.equal(filter({ properties: null })(), true)
  t.end()
})

test('==, string', function (t) {
  var f = filter(['==', 'foo', 'bar'])
  t.equal(f({ tags: { foo: 'bar' } }), true)
  t.equal(f({ tags: { foo: 'baz' } }), false)
  t.end()
})

test('==, number', function (t) {
  var f = filter(['==', 'foo', 0])
  t.equal(f({ tags: { foo: 0 } }), true)
  t.equal(f({ tags: { foo: 1 } }), false)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.equal(f({}), false)
  t.end()
})

test('==, null', function (t) {
  var f = filter(['==', 'foo', null])
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: 1 } }), false)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), true)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.equal(f({}), false)
  t.end()
})

test('==, $type', function (t) {
  var f = filter(['==', '$type', 'observation'])
  t.equal(f({ type: 'node' }), false)
  t.equal(f({ type: 'observation' }), true)
  t.end()
})

test('==, $id', function (t) {
  var f = filter(['==', '$id', 1234])

  t.equal(f({ id: 1234 }), true)
  t.equal(f({ id: '1234' }), false)
  t.equal(f({ tags: { id: 1234 } }), false)

  t.end()
})

test('==, string nested', function (t) {
  var f = filter(['==', ['foo', 'qux'], 'bar'])
  t.equal(f({ tags: { foo: 'bar' } }), false)
  t.equal(f({ tags: { foo: 'baz' } }), false)
  t.equal(f({ tags: { foo: { qux: 'bar' } } }), true)
  t.equal(f({ tags: { foo: { qux: 'baz' } } }), false)
  t.end()
})

test('!=, string', function (t) {
  var f = filter(['!=', 'foo', 'bar'])
  t.equal(f({ tags: { foo: 'bar' } }), false)
  t.equal(f({ tags: { foo: 'baz' } }), true)
  t.end()
})

test('!=, string nested', function (t) {
  var f = filter(['!=', ['foo', 'qux'], 'bar'])
  t.equal(f({ tags: { foo: 'bar' } }), true)
  t.equal(f({ tags: { foo: 'baz' } }), true)
  t.equal(f({ tags: { foo: { qux: 'bar' } } }), false)
  t.equal(f({ tags: { foo: { qux: 'baz' } } }), true)
  t.end()
})

test('!=, number', function (t) {
  var f = filter(['!=', 'foo', 0])
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: 1 } }), true)
  t.equal(f({ tags: { foo: '0' } }), true)
  t.equal(f({ tags: { foo: true } }), true)
  t.equal(f({ tags: { foo: false } }), true)
  t.equal(f({ tags: { foo: null } }), true)
  t.equal(f({ tags: { foo: undefined } }), true)
  t.equal(f({}), true)
  t.end()
})

test('!=, null', function (t) {
  var f = filter(['!=', 'foo', null])
  t.equal(f({ tags: { foo: 0 } }), true)
  t.equal(f({ tags: { foo: 1 } }), true)
  t.equal(f({ tags: { foo: '0' } }), true)
  t.equal(f({ tags: { foo: true } }), true)
  t.equal(f({ tags: { foo: false } }), true)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), true)
  t.equal(f({}), true)
  t.end()
})

test('!=, $type', function (t) {
  var f = filter(['!=', '$type', 'observation'])
  t.equal(f({ type: 'node' }), true)
  t.equal(f({ type: 'observation' }), false)
  t.end()
})

test('<, number', function (t) {
  var f = filter(['<', 'foo', 0])
  t.equal(f({ tags: { foo: 1 } }), false)
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: -1 } }), true)
  t.equal(f({ tags: { foo: '1' } }), false)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: '-1' } }), false)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.equal(f({}), false)
  t.end()
})

test('<, string', function (t) {
  var f = filter(['<', 'foo', '0'])
  t.equal(f({ tags: { foo: -1 } }), false)
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: 1 } }), false)
  t.equal(f({ tags: { foo: '1' } }), false)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: '-1' } }), true)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.end()
})

test('<, $created', function (t) {
  var f = filter(['<', '$created', '2019-09-26T00:00:00.000Z'])
  t.equal(f({ created_at: '2019-09-25T00:00:00.000Z' }), true)
  t.equal(f({ created_at: '2019-09-26T00:00:00.000Z' }), false)
  t.equal(f({ created_at: '2019-09-27T00:00:00.000Z' }), false)
  t.end()
})

test('<, $modified', function (t) {
  var f = filter(['<', '$modified', '2019-09-26T00:00:00.000Z'])
  t.equal(f({ timestamp: '2019-09-25T00:00:00.000Z' }), true)
  t.equal(f({ timestamp: '2019-09-26T00:00:00.000Z' }), false)
  t.equal(f({ timestamp: '2019-09-27T00:00:00.000Z' }), false)
  t.end()
})

test('<=, number', function (t) {
  var f = filter(['<=', 'foo', 0])
  t.equal(f({ tags: { foo: 1 } }), false)
  t.equal(f({ tags: { foo: 0 } }), true)
  t.equal(f({ tags: { foo: -1 } }), true)
  t.equal(f({ tags: { foo: '1' } }), false)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: '-1' } }), false)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.equal(f({}), false)
  t.end()
})

test('<=, string', function (t) {
  var f = filter(['<=', 'foo', '0'])
  t.equal(f({ tags: { foo: -1 } }), false)
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: 1 } }), false)
  t.equal(f({ tags: { foo: '1' } }), false)
  t.equal(f({ tags: { foo: '0' } }), true)
  t.equal(f({ tags: { foo: '-1' } }), true)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.end()
})

test('<=, $created', function (t) {
  var f = filter(['<=', '$created', '2019-09-26T00:00:00.000Z'])
  t.equal(f({ created_at: '2019-09-25T00:00:00.000Z' }), true)
  t.equal(f({ created_at: '2019-09-26T00:00:00.000Z' }), true)
  t.equal(f({ created_at: '2019-09-27T00:00:00.000Z' }), false)
  t.end()
})

test('<=, $modified', function (t) {
  var f = filter(['<=', '$modified', '2019-09-26T00:00:00.000Z'])
  t.equal(f({ timestamp: '2019-09-25T00:00:00.000Z' }), true)
  t.equal(f({ timestamp: '2019-09-26T00:00:00.000Z' }), true)
  t.equal(f({ timestamp: '2019-09-27T00:00:00.000Z' }), false)
  t.end()
})

test('>, number', function (t) {
  var f = filter(['>', 'foo', 0])
  t.equal(f({ tags: { foo: 1 } }), true)
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: -1 } }), false)
  t.equal(f({ tags: { foo: '1' } }), false)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: '-1' } }), false)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.equal(f({}), false)
  t.end()
})

test('>, string', function (t) {
  var f = filter(['>', 'foo', '0'])
  t.equal(f({ tags: { foo: -1 } }), false)
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: 1 } }), false)
  t.equal(f({ tags: { foo: '1' } }), true)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: '-1' } }), false)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.end()
})

test('>, $created', function (t) {
  var f = filter(['>', '$created', '2019-09-26T00:00:00.000Z'])
  t.equal(f({ created_at: '2019-09-25T00:00:00.000Z' }), false)
  t.equal(f({ created_at: '2019-09-26T00:00:00.000Z' }), false)
  t.equal(f({ created_at: '2019-09-27T00:00:00.000Z' }), true)
  t.end()
})

test('>, $modified', function (t) {
  var f = filter(['>', '$modified', '2019-09-26T00:00:00.000Z'])
  t.equal(f({ timestamp: '2019-09-25T00:00:00.000Z' }), false)
  t.equal(f({ timestamp: '2019-09-26T00:00:00.000Z' }), false)
  t.equal(f({ timestamp: '2019-09-27T00:00:00.000Z' }), true)
  t.end()
})

test('>=, number', function (t) {
  var f = filter(['>=', 'foo', 0])
  t.equal(f({ tags: { foo: 1 } }), true)
  t.equal(f({ tags: { foo: 0 } }), true)
  t.equal(f({ tags: { foo: -1 } }), false)
  t.equal(f({ tags: { foo: '1' } }), false)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: '-1' } }), false)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.equal(f({}), false)
  t.end()
})

test('>=, string', function (t) {
  var f = filter(['>=', 'foo', '0'])
  t.equal(f({ tags: { foo: -1 } }), false)
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: 1 } }), false)
  t.equal(f({ tags: { foo: '1' } }), true)
  t.equal(f({ tags: { foo: '0' } }), true)
  t.equal(f({ tags: { foo: '-1' } }), false)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.end()
})

test('>=, $created', function (t) {
  var f = filter(['>=', '$created', '2019-09-26T00:00:00.000Z'])
  t.equal(f({ created_at: '2019-09-25T00:00:00.000Z' }), false)
  t.equal(f({ created_at: '2019-09-26T00:00:00.000Z' }), true)
  t.equal(f({ created_at: '2019-09-27T00:00:00.000Z' }), true)
  t.end()
})

test('>=, $modified', function (t) {
  var f = filter(['>=', '$modified', '2019-09-26T00:00:00.000Z'])
  t.equal(f({ timestamp: '2019-09-25T00:00:00.000Z' }), false)
  t.equal(f({ timestamp: '2019-09-26T00:00:00.000Z' }), true)
  t.equal(f({ timestamp: '2019-09-27T00:00:00.000Z' }), true)
  t.end()
})

test('in, degenerate', function (t) {
  var f = filter(['in', 'foo'])
  t.equal(f({ tags: { foo: 1 } }), false)
  t.end()
})

test('in, string', function (t) {
  var f = filter(['in', 'foo', '0'])
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: '0' } }), true)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.equal(f({}), false)
  t.end()
})

test('in, string nested', function (t) {
  var f = filter(['in', ['foo', 'bar'], '0'])
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: { bar: 0 } } }), false)
  t.equal(f({ tags: { foo: { bar: '0' } } }), true)
  t.equal(f({ tags: { foo: { bar: true } } }), false)
  t.equal(f({ tags: { foo: { bar: false } } }), false)
  t.equal(f({ tags: { foo: { bar: null } } }), false)
  t.equal(f({ tags: { foo: { bar: undefined } } }), false)
  t.equal(f({}), false)
  t.end()
})

test('in, number', function (t) {
  var f = filter(['in', 'foo', 0])
  t.equal(f({ tags: { foo: 0 } }), true)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.end()
})

test('in, null', function (t) {
  var f = filter(['in', 'foo', null])
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: true } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), true)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.end()
})

test('in, multiple', function (t) {
  var f = filter(['in', 'foo', 0, 1])
  t.equal(f({ tags: { foo: 0 } }), true)
  t.equal(f({ tags: { foo: 1 } }), true)
  t.equal(f({ tags: { foo: 3 } }), false)
  t.end()
})

test('in, large_multiple', function (t) {
  var f = filter(['in', 'foo'].concat(Array.apply(null, { length: 2000 }).map(Number.call, Number)))
  t.equal(f({ tags: { foo: 0 } }), true)
  t.equal(f({ tags: { foo: 1 } }), true)
  t.equal(f({ tags: { foo: 1999 } }), true)
  t.equal(f({ tags: { foo: 2000 } }), false)
  t.end()
})

test('in, $type', function (t) {
  var f = filter(['in', '$type', 'observation', 'way'])
  t.equal(f({ type: 'node' }), false)
  t.equal(f({ type: 'observation' }), true)
  t.equal(f({ type: 'way' }), true)

  var f1 = filter(['in', '$type', 'node', 'way', 'observation'])
  t.equal(f1({ type: 'node' }), true)
  t.equal(f1({ type: 'way' }), true)
  t.equal(f1({ type: 'observation' }), true)

  t.end()
})

test('!in, degenerate', function (t) {
  var f = filter(['!in', 'foo'])
  t.equal(f({ tags: { foo: 1 } }), true)
  t.end()
})

test('!in, string', function (t) {
  var f = filter(['!in', 'foo', '0'])
  t.equal(f({ tags: { foo: 0 } }), true)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: null } }), true)
  t.equal(f({ tags: { foo: undefined } }), true)
  t.equal(f({}), true)
  t.end()
})

test('!in, string nested', function (t) {
  var f = filter(['!in', ['foo', 'bar'], '0'])
  t.equal(f({ tags: { foo: 0 } }), true)
  t.equal(f({ tags: { foo: '0' } }), true)
  t.equal(f({ tags: { foo: { bar: 0 } } }), true)
  t.equal(f({ tags: { foo: { bar: '0' } } }), false)
  t.equal(f({ tags: { foo: { bar: null } } }), true)
  t.equal(f({ tags: { foo: { bar: undefined } } }), true)
  t.equal(f({}), true)
  t.end()
})

test('!in, number', function (t) {
  var f = filter(['!in', 'foo', 0])
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: '0' } }), true)
  t.equal(f({ tags: { foo: null } }), true)
  t.equal(f({ tags: { foo: undefined } }), true)
  t.end()
})

test('!in, null', function (t) {
  var f = filter(['!in', 'foo', null])
  t.equal(f({ tags: { foo: 0 } }), true)
  t.equal(f({ tags: { foo: '0' } }), true)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), true)
  t.end()
})

test('!in, multiple', function (t) {
  var f = filter(['!in', 'foo', 0, 1])
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: 1 } }), false)
  t.equal(f({ tags: { foo: 3 } }), true)
  t.end()
})

test('!in, large_multiple', function (t) {
  var f = filter(['!in', 'foo'].concat(Array.apply(null, { length: 2000 }).map(Number.call, Number)))
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: 1 } }), false)
  t.equal(f({ tags: { foo: 1999 } }), false)
  t.equal(f({ tags: { foo: 2000 } }), true)
  t.end()
})

test('!in, $type', function (t) {
  var f = filter(['!in', '$type', 'observation', 'way'])
  t.equal(f({ type: 'node' }), true)
  t.equal(f({ type: 'observation' }), false)
  t.equal(f({ type: 'way' }), false)
  t.end()
})

test('any', function (t) {
  var f1 = filter(['any'])
  t.equal(f1({ tags: { foo: 1 } }), false)

  var f2 = filter(['any', ['==', 'foo', 1]])
  t.equal(f2({ tags: { foo: 1 } }), true)

  var f3 = filter(['any', ['==', 'foo', 0]])
  t.equal(f3({ tags: { foo: 1 } }), false)

  var f4 = filter(['any', ['==', 'foo', 0], ['==', 'foo', 1]])
  t.equal(f4({ tags: { foo: 1 } }), true)

  t.end()
})

test('all', function (t) {
  var f1 = filter(['all'])
  t.equal(f1({ tags: { foo: 1 } }), true)

  var f2 = filter(['all', ['==', 'foo', 1]])
  t.equal(f2({ tags: { foo: 1 } }), true)

  var f3 = filter(['all', ['==', 'foo', 0]])
  t.equal(f3({ tags: { foo: 1 } }), false)

  var f4 = filter(['all', ['==', 'foo', 0], ['==', 'foo', 1]])
  t.equal(f4({ tags: { foo: 1 } }), false)

  t.end()
})

test('none', function (t) {
  var f1 = filter(['none'])
  t.equal(f1({ tags: { foo: 1 } }), true)

  var f2 = filter(['none', ['==', 'foo', 1]])
  t.equal(f2({ tags: { foo: 1 } }), false)

  var f3 = filter(['none', ['==', 'foo', 0]])
  t.equal(f3({ tags: { foo: 1 } }), true)

  var f4 = filter(['none', ['==', 'foo', 0], ['==', 'foo', 1]])
  t.equal(f4({ tags: { foo: 1 } }), false)

  t.end()
})

test('has', function (t) {
  var f = filter(['has', 'foo'])
  t.equal(f({ tags: { foo: 0 } }), true)
  t.equal(f({ tags: { foo: 1 } }), true)
  t.equal(f({ tags: { foo: '0' } }), true)
  t.equal(f({ tags: { foo: true } }), true)
  t.equal(f({ tags: { foo: false } }), true)
  t.equal(f({ tags: { foo: null } }), true)
  t.equal(f({ tags: { foo: undefined } }), true)
  t.equal(f({}), false)
  t.end()
})

test('!has', function (t) {
  var f = filter(['!has', 'foo'])
  t.equal(f({ tags: { foo: 0 } }), false)
  t.equal(f({ tags: { foo: 1 } }), false)
  t.equal(f({ tags: { foo: '0' } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: false } }), false)
  t.equal(f({ tags: { foo: null } }), false)
  t.equal(f({ tags: { foo: undefined } }), false)
  t.equal(f({}), true)
  t.end()
})
