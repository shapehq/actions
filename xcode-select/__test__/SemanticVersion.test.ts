import {semanticVersionSort} from "../src/SemanticVersion/SemanticVersion"

test("It sorts array of semantic versions", () => {
  expect(
    [
      {major: 14, minor: 3, patch: 1},
      {major: 14, minor: 3, patch: 0},
      {major: 15, minor: 0, patch: 0},
      {major: 13, minor: 1, patch: 2},
      {major: 13, minor: 2, patch: 4}
    ].sort(semanticVersionSort)
  ).toEqual([
    {major: 13, minor: 1, patch: 2},
    {major: 13, minor: 2, patch: 4},
    {major: 14, minor: 3, patch: 0},
    {major: 14, minor: 3, patch: 1},
    {major: 15, minor: 0, patch: 0}
  ])
})

test("It sorts array of semantic versions with null components", () => {
  expect(
    [
      {major: 14, minor: 3, patch: 1},
      {major: 14, minor: 3, patch: null},
      {major: 15, minor: null, patch: null},
      {major: 13, minor: 1, patch: 2},
      {major: 13, minor: 2, patch: 4}
    ].sort(semanticVersionSort)
  ).toEqual([
    {major: 13, minor: 1, patch: 2},
    {major: 13, minor: 2, patch: 4},
    {major: 14, minor: 3, patch: null},
    {major: 14, minor: 3, patch: 1},
    {major: 15, minor: null, patch: null}
  ])
})
