#!/bin/bash

fns=(
  'defaults'
  'findKey'
  'get'
  'keyBy'
  'mapKeys'
  'minBy'
  'maxBy'
  'merge'
  'omit'
  'once'
  'set'
  'sortBy'
  'toNumber'
)

list=$(printf ",%s" "${fns[@]}")
list=${list:1}
union=$(printf "|'%s'" "${fns[@]}")
union=${union:1}

node_modules/.bin/lodash exports=node include="$list" -o vendor/lodash.js
