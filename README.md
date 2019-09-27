## Mapeo Entity Filter

[![Build Status](https://travis-ci.org/digidem/mapeo-entity-filter.svg?branch=master)](https://travis-ci.org/digidem/mapeo-entity-filter)
[![npm](https://img.shields.io/npm/v/mapeo-entity-filter.svg)](https://www.npmjs.com/package/mapeo-entity-filter)

This library is forked from
[mapbox/feature-filter](https://github.com/mapbox/feature-filter), but adapted
to work with entities in the [mapeo-core](https://github.com/digidem/mapeo-core)
database. This library implements the semantics specified by the [Mapbox GL JS
spec](https://www.mapbox.com/mapbox-gl-style-spec/#other-filter), but supports
arrays as keys as well as strings, in order to filter against nested tags.

### API

`compile(filter)`

Given a filter expressed as nested arrays, return a new function that evaluates
whether a given feature passes its test.

#### Parameters

| parameter | type  | description      |
| --------- | ----- | ---------------- |
| `filter`  | Array | mapbox gl filter |

**Returns** `Function`, filter-evaluating function

### Usage

```javascript
var compile = require('mapeo-entity-filter');

// will match a feature with class of street_limited,
// AND an admin_level less than or equal to 3,
// that's NOT a polygon.
var filter = [
    "all",
    ["==", "class", "street_limited"],
    ["<=", "admin_level", 3]
]

// testFilter will be a function that returns a boolean
var testFilter = compile(filter);

// Layer feature that you're testing. Must have type
// and properties keys.
var entity = {
  tags: {
    class: "street_limited"
    admin_level: 1
  }
};

// will return a boolean based on whether the feature matched the filter
return testFilter(entity);
```

### Filter expression language

#### Existential Filters

`["has", key]` object[_key_] exists

`["!has", key]` object[_key_] does not exist

#### Comparison Filters

`["==", key, value]` equality: object[_key_] = value

`["!=", key, value]` inequality: object[_key_] ≠ value

`[">", key, value]` greater than: object[_key_] > value

`[">=", key, value]` greater than or equal: object[_key_] ≥ value

`["<", key, value]` less than: object[_key_] < value

`["<=", key, value]` less than or equal: object[_key_] ≤ value

#### Set Membership Filters

`["in", key, v0, ..., vn]` set inclusion: _object[key] ∈ {v0, ..., vn}_

`["!in", key, v0, ..., vn]` set exclusion: _object[key] ∉ {v0, ..., vn}_

#### Combining Filters

`["all", f0, ..., fn]` logical `AND`: _f0 ∧ ... ∧ fn_

`["any", f0, ..., fn]` logical `OR`: _f0 ∨ ... ∨ fn_

`["none", f0, ..., fn]` logical `NOR`: _¬f0 ∧ ... ∧ ¬fn_

A _key_ must be a string that identifies a entity tag, or one of the following special keys:

* `$type`: the entity type. This key may be used with the `"=="`,`"!="`,
  `"in"`, and `"!in"` operators. Possible values are `"observation"`, `"node"`,
  and `"way"`.
* `$id`: the entity identifier. This key may be used with the `"=="`,`"!="`,
  `"in"`, and `"!in"` operators.
* `$created`: the timestamp the entity was created (ISO string).
* `$modified`: the timestamp the entity was modified (ISO string).

A value (and v0, ..., vn for set operators) must be a [string](#string), [number](#number), or [boolean](#boolean) to compare the tag value against.

Set membership filters are a compact and efficient way to test whether a field matches any of multiple values.

The comparison and set membership filters implement strictly-typed comparisons; for example, all of the following evaluate to false: `0 < "1"`, `2 == "2"`, `"true" in [true, false]`.

The `"all"`, `"any"`, and `"none"` filter operators are used to create compound filters. The values f0, ..., fn must be filter expressions themselves.

```json
["==", "class", "street_major"]
```

This filter requires that the `class` tag of each feature is equal to either "street_major", "street_minor", or "street_limited".

```json
["in", "class", "street_major", "street_minor", "street_limited"]
```

The combining filter "all" takes the three other filters that follow it and requires all of them to be true for a feature to be included: a feature must have a `class` equal to "street_limited", its `admin_level` must be greater than or equal to 3.

```json
[
  "all",
  ["==", "class", "street_limited"],
  [">=", "admin_level", 3]
]
```
